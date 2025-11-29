package handlers

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"mireabots-api/internal/models"
	"mireabots-api/internal/ml"
)

type PredictHandler struct {
	db *sql.DB
}

func NewPredictHandler(db *sql.DB) *PredictHandler {
	return &PredictHandler{db: db}
}

// Predict обрабатывает запрос на прогноз дохода клиента
func (h *PredictHandler) Predict(c *gin.Context) {
	var req models.PredictRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	// Получение данных клиента из БД
	clientData, err := h.getClientData(req.ClientID)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": fmt.Sprintf("Client with ID %d not found", req.ClientID)})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get client data: " + err.Error()})
		return
	}

	// Получение прогноза от ML-модели
	prediction, err := ml.PredictIncome(clientData)
	if err != nil {
		log.Printf("ML prediction error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get prediction: " + err.Error()})
		return
	}

	// Объединяем рекомендации от ML-сервиса с нашими
	allRecommendations := h.mergeRecommendations(prediction)

	// Формирование ответа
	response := models.PredictResponse{
		ClientID:        req.ClientID,
		PredictedIncome: prediction.Income,
		IncomeCategory:  prediction.Category,
		Confidence:      prediction.Confidence,
		Explanation:     prediction.Explanation,
		Recommendations: allRecommendations,
		ClientData:      clientData,
	}

	c.JSON(http.StatusOK, response)
}

// getClientData получает данные клиента из БД
func (h *PredictHandler) getClientData(clientID int) (map[string]interface{}, error) {
	// Если БД недоступна, возвращаем мок-данные для тестирования
	if h.db == nil {
		return h.getMockClientData(clientID), nil
	}

	query := `
		SELECT 
			id, dt, turn_cur_cr_avg_act_v2, salary_6to12m_avg, hdb_bki_total_max_limit,
			dp_ils_paymentssum_avg_12m, hdb_bki_total_cc_max_limit, incomeValue, gender,
			avg_cur_cr_turn, adminarea, turn_cur_cr_avg_v2, turn_cur_cr_max_v2,
			hdb_bki_total_pil_max_limit, age, dp_ils_avg_salary_1y, turn_cur_cr_sum_v2,
			turn_cur_db_sum_v2, turn_cur_db_avg_act_v2, dp_ils_avg_salary_2y,
			curr_rur_amt_cm_avg, turn_cur_db_avg_v2, dp_ils_paymentssum_avg_6m,
			avg_cur_db_turn, hdb_bki_active_cc_max_limit, incomeValueCategory,
			city_smart_name, loan_cnt, client_active_flag, blacklist_flag
		FROM hackathon_income_test 
		WHERE id = $1
	`

	var data struct {
		ID                                 sql.NullInt64
		Dt                                 sql.NullString
		TurnCurCrAvgActV2                 sql.NullFloat64
		Salary6to12mAvg                   sql.NullFloat64
		HdbBkiTotalMaxLimit               sql.NullFloat64
		DpIlsPaymentssumAvg12m            sql.NullFloat64
		HdbBkiTotalCcMaxLimit             sql.NullFloat64
		IncomeValue                        sql.NullFloat64
		Gender                             sql.NullString
		AvgCurCrTurn                      sql.NullFloat64
		Adminarea                         sql.NullString
		TurnCurCrAvgV2                    sql.NullFloat64
		TurnCurCrMaxV2                    sql.NullFloat64
		HdbBkiTotalPilMaxLimit            sql.NullFloat64
		Age                               sql.NullFloat64
		DpIlsAvgSalary1y                  sql.NullFloat64
		TurnCurCrSumV2                    sql.NullFloat64
		TurnCurDbSumV2                    sql.NullFloat64
		TurnCurDbAvgActV2                 sql.NullFloat64
		DpIlsAvgSalary2y                  sql.NullFloat64
		CurrRurAmtCmAvg                   sql.NullFloat64
		TurnCurDbAvgV2                    sql.NullFloat64
		DpIlsPaymentssumAvg6m              sql.NullFloat64
		AvgCurDbTurn                      sql.NullFloat64
		HdbBkiActiveCcMaxLimit            sql.NullFloat64
		IncomeValueCategory               sql.NullString
		CitySmartName                     sql.NullString
		LoanCnt                           sql.NullFloat64
		ClientActiveFlag                  sql.NullFloat64
		BlacklistFlag                     sql.NullFloat64
	}

	// Проверка на nil БД
	if h.db == nil {
		return h.getMockClientData(clientID), nil
	}

	err := h.db.QueryRow(query, clientID).Scan(
		&data.ID, &data.Dt, &data.TurnCurCrAvgActV2, &data.Salary6to12mAvg,
		&data.HdbBkiTotalMaxLimit, &data.DpIlsPaymentssumAvg12m, &data.HdbBkiTotalCcMaxLimit,
		&data.IncomeValue, &data.Gender, &data.AvgCurCrTurn, &data.Adminarea,
		&data.TurnCurCrAvgV2, &data.TurnCurCrMaxV2, &data.HdbBkiTotalPilMaxLimit,
		&data.Age, &data.DpIlsAvgSalary1y, &data.TurnCurCrSumV2, &data.TurnCurDbSumV2,
		&data.TurnCurDbAvgActV2, &data.DpIlsAvgSalary2y, &data.CurrRurAmtCmAvg,
		&data.TurnCurDbAvgV2, &data.DpIlsPaymentssumAvg6m, &data.AvgCurDbTurn,
		&data.HdbBkiActiveCcMaxLimit, &data.IncomeValueCategory, &data.CitySmartName,
		&data.LoanCnt, &data.ClientActiveFlag, &data.BlacklistFlag,
	)

	if err != nil {
		return nil, err
	}

	// Преобразование в map для удобства работы с ML-моделью
	clientData := make(map[string]interface{})
	
	// Преобразуем все поля в map, обрабатывая NULL значения
	if data.ID.Valid {
		clientData["id"] = data.ID.Int64
	}
	if data.Age.Valid {
		clientData["age"] = data.Age.Float64
	}
	if data.Gender.Valid {
		clientData["gender"] = data.Gender.String
	}
	if data.CitySmartName.Valid {
		clientData["city_smart_name"] = data.CitySmartName.String
	}
	if data.Salary6to12mAvg.Valid {
		clientData["salary_6to12m_avg"] = data.Salary6to12mAvg.Float64
	}
	if data.DpIlsAvgSalary1y.Valid {
		clientData["dp_ils_avg_salary_1y"] = data.DpIlsAvgSalary1y.Float64
	}
	if data.DpIlsAvgSalary2y.Valid {
		clientData["dp_ils_avg_salary_2y"] = data.DpIlsAvgSalary2y.Float64
	}
	if data.TurnCurCrAvgActV2.Valid {
		clientData["turn_cur_cr_avg_act_v2"] = data.TurnCurCrAvgActV2.Float64
	}
	if data.TurnCurDbAvgActV2.Valid {
		clientData["turn_cur_db_avg_act_v2"] = data.TurnCurDbAvgActV2.Float64
	}
	if data.LoanCnt.Valid {
		clientData["loan_cnt"] = data.LoanCnt.Float64
	}
	if data.ClientActiveFlag.Valid {
		clientData["client_active_flag"] = data.ClientActiveFlag.Float64
	}
	if data.BlacklistFlag.Valid {
		clientData["blacklist_flag"] = data.BlacklistFlag.Float64
	}

	// Добавляем остальные поля (можно расширить по необходимости)
	// Для упрощения, добавляем только основные поля, остальные можно добавить аналогично

	return clientData, nil
}

// generateRecommendations генерирует рекомендации на основе прогноза
func (h *PredictHandler) generateRecommendations(prediction *ml.PredictionResult) []models.Recommendation {
	var recommendations []models.Recommendation

	// Рекомендации на основе прогнозируемого дохода
	if prediction.Income > 1000000 {
		recommendations = append(recommendations, models.Recommendation{
			Product:     "Премиум карта",
			Description: "Кредитная карта с повышенным лимитом и кэшбэком",
			Reason:      "Высокий прогнозируемый доход позволяет получить премиальные продукты",
			Priority:    "high",
		})
		recommendations = append(recommendations, models.Recommendation{
			Product:     "Инвестиционный счет",
			Description: "Управление капиталом и инвестиционные продукты",
			Reason:      "Высокий доход позволяет эффективно инвестировать",
			Priority:    "medium",
		})
	} else if prediction.Income > 500000 {
		recommendations = append(recommendations, models.Recommendation{
			Product:     "Стандартная кредитная карта",
			Description: "Кредитная карта с кэшбэком до 5%",
			Reason:      "Средний доход позволяет получить стандартные кредитные продукты",
			Priority:    "high",
		})
		recommendations = append(recommendations, models.Recommendation{
			Product:     "Накопительный счет",
			Description: "Накопительный счет с повышенной процентной ставкой",
			Reason:      "Поможет эффективно накапливать средства",
			Priority:    "medium",
		})
	} else {
		recommendations = append(recommendations, models.Recommendation{
			Product:     "Дебетовая карта с кэшбэком",
			Description: "Дебетовая карта с кэшбэком на основные категории",
			Reason:      "Базовый продукт для клиентов с низким доходом",
			Priority:    "high",
		})
	}

	// Рекомендации на основе важных признаков
	for _, feature := range prediction.Explanation {
		if feature.Importance > 0.1 {
			switch feature.Feature {
			case "salary_6to12m_avg":
				if feature.Impact > 0 {
					recommendations = append(recommendations, models.Recommendation{
						Product:     "Зарплатный проект",
						Description: "Специальные условия для зарплатных клиентов",
						Reason:      "Стабильный доход позволяет получить льготные условия",
						Priority:    "medium",
					})
				}
			case "loan_cnt":
				if feature.Value > 0 && feature.Impact < 0 {
					recommendations = append(recommendations, models.Recommendation{
						Product:     "Рефинансирование",
						Description: "Объединение нескольких кредитов в один",
						Reason:      "Множественные кредиты могут снижать кредитоспособность",
						Priority:    "high",
					})
				}
			}
		}
	}

	return recommendations
}

// mergeRecommendations объединяет рекомендации от ML-сервиса с нашими
func (h *PredictHandler) mergeRecommendations(prediction *ml.PredictionResult) []models.Recommendation {
	var allRecommendations []models.Recommendation

	// Добавляем рекомендации от ML-сервиса (приоритетные)
	for _, mlRec := range prediction.MLRecommendations {
		allRecommendations = append(allRecommendations, models.Recommendation{
			Product:     mlRec.ProductName,
			Description: mlRec.Reason,
			Reason:      mlRec.Reason,
			Priority:    "high", // Рекомендации от ML-сервиса всегда высокого приоритета
		})
	}

	// Добавляем наши дополнительные рекомендации
	ourRecs := h.generateRecommendations(prediction)
	allRecommendations = append(allRecommendations, ourRecs...)

	return allRecommendations
}

// getMockClientData возвращает мок-данные клиента для тестирования без БД
func (h *PredictHandler) getMockClientData(clientID int) map[string]interface{} {
	return map[string]interface{}{
		"id":                        int64(clientID),
		"age":                       35.0,
		"gender":                    "M",
		"city_smart_name":           "Москва",
		"salary_6to12m_avg":         50000.0,
		"dp_ils_avg_salary_1y":      600000.0,
		"dp_ils_avg_salary_2y":      550000.0,
		"turn_cur_cr_avg_act_v2":    100000.0,
		"turn_cur_db_avg_act_v2":   80000.0,
		"loan_cnt":                 2.0,
		"client_active_flag":        1.0,
		"blacklist_flag":           0.0,
		"hdb_bki_total_max_limit":   500000.0,
		"dp_ils_paymentssum_avg_12m": 40000.0,
	}
}

