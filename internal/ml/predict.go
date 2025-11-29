package ml

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"mireabots-api/internal/models"
)

// PredictionResult - результат прогноза от ML-модели
type PredictionResult struct {
	Income      float64                `json:"predicted_income"`
	Category    string                 `json:"segment"` // Mass/Middle/Premium
	Confidence  float64                `json:"confidence"`
	Explanation []models.FeatureImportance `json:"shap_explanation"`
	Currency    string                 `json:"currency"`
	MLRecommendations []MLRecommendation `json:"recommendations"`
}

// MLRecommendation - рекомендация от ML-сервиса
type MLRecommendation struct {
	ProductName string `json:"product_name"`
	Reason      string `json:"reason"`
}

// MLRequest - запрос к ML-сервису
type MLRequest struct {
	Features map[string]interface{} `json:"features"`
}

// PredictIncome получает прогноз дохода от ML-модели
func PredictIncome(clientData map[string]interface{}) (*PredictionResult, error) {
	// URL ML-сервиса (можно вынести в переменные окружения)
	mlServiceURL := os.Getenv("ML_SERVICE_URL")
	if mlServiceURL == "" {
		mlServiceURL = "http://localhost:8000" // Дефолтный URL для Python FastAPI сервиса
	}

	// Подготовка данных для отправки в формате, который ожидает Python сервис
	mlRequest := MLRequest{
		Features: clientData,
	}
	
	requestBody, err := json.Marshal(mlRequest)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal client data: %w", err)
	}

	// Создание HTTP запроса
	req, err := http.NewRequest("POST", mlServiceURL+"/predict", bytes.NewBuffer(requestBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")

	// Выполнение запроса с таймаутом
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	resp, err := client.Do(req)
	if err != nil {
		// Если ML-сервис недоступен, возвращаем мок-данные для разработки
		log.Printf("ML service unavailable, using mock data: %v", err)
		return generateMockPrediction(clientData), nil
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("ML service returned status %d: %s", resp.StatusCode, string(body))
	}

	// Парсинг ответа от Python сервиса
	var pythonResponse struct {
		PredictedIncome float64 `json:"predicted_income"`
		Currency        string  `json:"currency"`
		Segment         string  `json:"segment"`
		ShapExplanation []struct {
			Feature     string  `json:"feature"`
			Impact      float64 `json:"impact"`
			Description string  `json:"description"`
		} `json:"shap_explanation"`
		Recommendations []struct {
			ProductName string `json:"product_name"`
			Reason      string `json:"reason"`
		} `json:"recommendations"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&pythonResponse); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	// Преобразуем SHAP объяснение в наш формат
	explanation := make([]models.FeatureImportance, 0, len(pythonResponse.ShapExplanation))
	maxAbsImpact := 0.0
	for _, shapFeat := range pythonResponse.ShapExplanation {
		absImpact := abs(shapFeat.Impact)
		if absImpact > maxAbsImpact {
			maxAbsImpact = absImpact
		}
		// Получаем значение признака из clientData
		value := getFloat64(clientData, shapFeat.Feature)
		explanation = append(explanation, models.FeatureImportance{
			Feature:    shapFeat.Feature,
			Value:      value,
			Impact:     shapFeat.Impact,
			Importance: absImpact, // Нормализуем позже
		})
	}

	// Нормализуем importance относительно максимального значения
	if maxAbsImpact > 0 {
		for i := range explanation {
			explanation[i].Importance = explanation[i].Importance / maxAbsImpact
		}
	}

	// Преобразуем рекомендации от ML-сервиса
	mlRecs := make([]MLRecommendation, 0, len(pythonResponse.Recommendations))
	for _, rec := range pythonResponse.Recommendations {
		mlRecs = append(mlRecs, MLRecommendation{
			ProductName: rec.ProductName,
			Reason:      rec.Reason,
		})
	}

	return &PredictionResult{
		Income:            pythonResponse.PredictedIncome,
		Category:          pythonResponse.Segment,
		Confidence:        0.85, // Python сервис не возвращает confidence, используем дефолт
		Explanation:       explanation,
		Currency:          pythonResponse.Currency,
		MLRecommendations: mlRecs,
	}, nil
}

// generateMockPrediction генерирует мок-прогноз для разработки
func generateMockPrediction(clientData map[string]interface{}) *PredictionResult {
	// Простая логика для мок-данных
	var predictedIncome float64 = 500000 // Дефолтное значение

	// Используем доступные данные для простого прогноза
	if salary, ok := clientData["salary_6to12m_avg"].(float64); ok && salary > 0 {
		predictedIncome = salary * 12 // Годовая зарплата
	} else if salary1y, ok := clientData["dp_ils_avg_salary_1y"].(float64); ok && salary1y > 0 {
		predictedIncome = salary1y
	}

	// Определение категории дохода
	var category string
	if predictedIncome >= 1000000 {
		category = "Above_1M"
	} else if predictedIncome >= 500000 {
		category = "500k_to_1M"
	} else {
		category = "Below_50k"
	}

	// Генерация объяснения (важные признаки)
	explanation := []models.FeatureImportance{
		{
			Feature:    "salary_6to12m_avg",
			Value:      getFloat64(clientData, "salary_6to12m_avg"),
			Impact:     0.4,
			Importance: 0.35,
		},
		{
			Feature:    "dp_ils_avg_salary_1y",
			Value:      getFloat64(clientData, "dp_ils_avg_salary_1y"),
			Impact:     0.3,
			Importance: 0.25,
		},
		{
			Feature:    "age",
			Value:      getFloat64(clientData, "age"),
			Impact:     0.15,
			Importance: 0.15,
		},
		{
			Feature:    "loan_cnt",
			Value:      getFloat64(clientData, "loan_cnt"),
			Impact:     -0.1,
			Importance: 0.1,
		},
		{
			Feature:    "turn_cur_cr_avg_act_v2",
			Value:      getFloat64(clientData, "turn_cur_cr_avg_act_v2"),
			Impact:     0.1,
			Importance: 0.15,
		},
	}

	return &PredictionResult{
		Income:      predictedIncome,
		Category:    category,
		Confidence:  0.75, // Мок-уверенность
		Explanation: explanation,
	}
}

func getFloat64(data map[string]interface{}, key string) float64 {
	if val, ok := data[key].(float64); ok {
		return val
	}
	return 0
}

func abs(x float64) float64 {
	if x < 0 {
		return -x
	}
	return x
}

