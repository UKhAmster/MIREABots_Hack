package models

// PredictRequest - запрос на прогноз дохода клиента
type PredictRequest struct {
	ClientID int `json:"client_id" binding:"required"`
}

// PredictResponse - ответ с результатами прогноза
type PredictResponse struct {
	ClientID          int                    `json:"client_id"`
	PredictedIncome   float64                `json:"predicted_income"`
	IncomeCategory    string                 `json:"income_category"`
	Confidence        float64                `json:"confidence"`
	Explanation       []FeatureImportance    `json:"explanation"`
	Recommendations   []Recommendation       `json:"recommendations"`
	ClientData        map[string]interface{} `json:"client_data,omitempty"`
}

// FeatureImportance - важность признака для прогноза
type FeatureImportance struct {
	Feature   string  `json:"feature"`
	Value     float64 `json:"value"`
	Impact    float64 `json:"impact"` // Влияние на прогноз (положительное/отрицательное)
	Importance float64 `json:"importance"` // Важность признака (0-1)
}

// Recommendation - рекомендация для клиента
type Recommendation struct {
	Product     string `json:"product"`
	Description string `json:"description"`
	Reason      string `json:"reason"`
	Priority    string `json:"priority"` // high, medium, low
}

