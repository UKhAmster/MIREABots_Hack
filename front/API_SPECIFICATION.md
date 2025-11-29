# API Specification для Alpha Pred

Документация API endpoints для интеграции фронтенда с бэкендом.

## Базовый URL

```
http://localhost:8000/api
```

Или настраивается через переменную окружения `VITE_API_BASE_URL`.

---

## 1. Получение данных клиента

### Endpoint
```
GET /clients/{client_id}
```

### Описание
Возвращает полные данные клиента по его ID для отображения профиля.

### Параметры
- `client_id` (path, required) - ID клиента (строка или число)

### Пример запроса
```http
GET /api/clients/12345
```

### Пример ответа (200 OK)
```json
{
  "id": "12345",
  "age": 35,
  "gender": 1,
  "city_smart_name": "Москва",
  "dt": "2024-01-15",
  "dp_ewb_last_employment_position": "Менеджер по продажам",
  
  "hdb_bki_total_max_limit": 500000,
  "hdb_bki_total_cnt": 3,
  "hdb_bki_total_max_overdue_sum": 0,
  "hdb_bki_active_cc_max_limit": 300000,
  "hdb_bki_total_pil_max_limit": 200000,
  "bki_total_products": 5,
  
  "incomeValue": 125000,
  "incomeValueCategory": "100k_250k",
  "incomeValueCategoryLabel": "100 000 - 250 000 ₽",
  "confidence": "Высокая",
  "averageRegionalIncome": 120000,
  "incomeStatus": "above",
  "incomeStatusLabel": "Выше среднего",
  "debtLoadPercent": 6.2,
  
  "curr_rur_amt_cm_avg": 150000,
  "dp_ils_avg_salary_1y": 120000,
  
  "loanacc_rur_amt_cm_avg": 25000,
  "turn_cur_cr_sum_v2": 450000,
  "turn_cur_db_sum_v2": 380000,
  "mob_cnt_days": 28,
  "avg_amount_daily_transactions_90d": 12500,
  
  "blacklist_flag": 0,
  "ovrd_sum": 0,
  "label_Below_50k_share_r1": 0.15,
  "label_Above_1M_share_r1": 0.05,
  
  "hdb_bki_total_products": 2,
  "transaction_category_supermarket_percent_cnt_2m": 0.35,
  "transaction_category_restaurants_percent_cnt_2m": 0.20,
  "avg_by_category__amount__sum__cashflowcategory_name__supermarkety": 45000,
  "avg_by_category__amount__sum__cashflowcategory_name__kafe": 25000,
  
  "dp_ils_total_seniority": 120,
  "dp_ils_max_seniority": 48,
  "dp_ils_cnt_changes_1y": 0,
  "dp_ils_employeers_cnt_last_month": 1,
  "dp_ils_avg_simultanious_jobs_5y": 1.2
}
```

### Дополнительные поля (вычисляются на бэкенде)
- `confidence` (string) - Уровень уверенности модели: "Высокая", "Средняя", "Низкая"
- `incomeValueCategoryLabel` (string) - Текстовая метка категории дохода
- `averageRegionalIncome` (number) - Средний доход по региону
- `incomeStatus` (string) - Статус дохода: "above", "below", "normal"
- `incomeStatusLabel` (string) - Текстовая метка статуса: "Выше среднего", "Ниже среднего", "В норме"
- `debtLoadPercent` (number) - Процент кредитной нагрузки (0-100)

### Ошибки
- `404 Not Found` - Клиент не найден
- `500 Internal Server Error` - Ошибка сервера

---

## 2. Получение SHAP значений для клиента

### Endpoint
```
GET /clients/{client_id}/shap
```

### Описание
Возвращает SHAP значения (факторы влияния) для объяснения прогноза дохода клиента.

### Параметры
- `client_id` (path, required) - ID клиента

### Пример запроса
```http
GET /api/clients/12345/shap
```

### Пример ответа (200 OK)
```json
[
  {
    "feature": "Траты на путешествия",
    "value": 0.15,
    "impact": "positive"
  },
  {
    "feature": "Наличие вклада",
    "value": 0.12,
    "impact": "positive"
  },
  {
    "feature": "Возраст",
    "value": -0.08,
    "impact": "negative"
  },
  {
    "feature": "Просрочки по кредитам",
    "value": -0.05,
    "impact": "negative"
  }
]
```

### Формат данных
- `feature` (string) - Название фактора
- `value` (float) - Значение влияния (от -1 до 1)
- `impact` (string) - Тип влияния: "positive" или "negative"

---

## 3. Получение сводной информации по доходам банка

### Endpoint
```
GET /dashboard/summary
```

### Описание
Возвращает сводную информацию по доходам банка: общие показатели и кредитный портфель с рисками.

### Пример запроса
```http
GET /api/dashboard/summary
```

### Пример ответа (200 OK)
```json
{
  "general": {
    "total_clients": 1245000,
    "avg_income": 85400,
    "total_loans": 45200000000,
    "avg_age": 38.5
  },
  "credit_and_risk": {
    "total_credit_limit": 125000000000,
    "total_overdue": 45000000,
    "clients_with_overdue": 12450,
    "blacklisted_clients": 127
  },
  "trends": {
    "total_clients_change": 2.3,
    "avg_income_change": -1.2,
    "total_loans_change": 5.7,
    "total_overdue_change": 8.5
  }
}
```

### Поля ответа

**general** (object) - Общие показатели:
- `total_clients` (integer) - Всего клиентов (COUNT(['id']))
- `avg_income` (float) - Средний доход (AVG(['incomeValue']))
- `total_loans` (integer) - Общая сумма кредитов (SUM(['loanacc_rur_amt_cm_avg']))
- `avg_age` (float) - Средний возраст (AVG(['age']))

**credit_and_risk** (object) - Кредитный портфель и Риски:
- `total_credit_limit` (integer) - Общий кредитный лимит (SUM(['hdb_bki_total_max_limit']))
- `total_overdue` (integer) - Общая сумма просрочек (SUM(['hdb_bki_total_max_overdue_sum']))
- `clients_with_overdue` (integer) - Клиентов с просрочками (COUNT(['hdb_bki_total_max_overdue_sum'] > 0))
- `blacklisted_clients` (integer) - В черном списке (COUNT(['blacklist_flag']))

**trends** (object) - Изменения в процентах:
- `total_clients_change` (float) - Изменение количества клиентов (%)
- `avg_income_change` (float) - Изменение среднего дохода (%)
- `total_loans_change` (float) - Изменение общей суммы кредитов (%)
- `total_overdue_change` (float) - Изменение суммы просрочек (%) - положительное значение означает рост

### Ошибки
- `500 Internal Server Error` - Ошибка сервера

---

## 4. Получение агрегированных данных по банку

### Endpoint
```
GET /dashboard/aggregations
```

### Описание
Возвращает агрегированные метрики по всем клиентам банка.

### Пример запроса
```http
GET /api/dashboard/aggregations
```

### Пример ответа (200 OK)
```json
{
  "total_clients": 15420,
  "avg_income": 95000,
  "total_loans": 3850000000,
  "avg_age": 38.5,
  "blacklist_count": 127,
  "total_credit_limit": 12500000000,
  "avg_credits": 2.3,
  "total_overdue": 45000000,
  "clients_with_overdue": 1240
}
```

### Поля ответа
- `total_clients` или `count_id` (integer) - Всего клиентов
- `avg_income` или `avg_incomeValue` (float) - Средний доход
- `total_loans` или `sum_loanacc_rur_amt_cm_avg` (integer) - Общая сумма кредитов
- `avg_age` (float) - Средний возраст
- `blacklist_count` или `count_blacklist_flag` (integer) - Клиентов в черном списке
- `total_credit_limit` или `sum_hdb_bki_total_max_limit` (integer) - Общий кредитный лимит
- `avg_credits` или `avg_hdb_bki_total_cnt` (float) - Среднее количество кредитов
- `total_overdue` или `sum_hdb_bki_total_max_overdue_sum` (integer) - Общая сумма просрочек
- `clients_with_overdue` или `count_overdue` (integer) - Клиенты с просрочками

---

## 5. Получение динамики по датам

### Endpoint
```
GET /dashboard/dynamics?days={days}
```

### Описание
Возвращает динамику метрик за указанное количество дней.

### Параметры запроса
- `days` (query, optional) - Количество дней (по умолчанию 30)

### Пример запроса
```http
GET /api/dashboard/dynamics?days=30
```

### Пример ответа (200 OK)
```json
[
  {
    "dt": "2024-01-15",
    "date": "15.01",
    "sum_incomeValue": 50000000,
    "total_income": 50000000,
    "sum_loanacc_rur_amt_cm_avg": 120000000,
    "total_loans": 120000000,
    "count_id": 50,
    "new_clients": 50,
    "sum_ovrd_sum": 1500000,
    "total_overdue": 1500000
  },
  {
    "dt": "2024-01-16",
    "date": "16.01",
    "sum_incomeValue": 51000000,
    "total_income": 51000000,
    "sum_loanacc_rur_amt_cm_avg": 125000000,
    "total_loans": 125000000,
    "count_id": 52,
    "new_clients": 52,
    "sum_ovrd_sum": 1450000,
    "total_overdue": 1450000
  }
]
```

### Формат данных
- `dt` или `date` (string) - Дата в формате YYYY-MM-DD
- `sum_incomeValue` или `total_income` (integer) - Сумма доходов за день
- `sum_loanacc_rur_amt_cm_avg` или `total_loans` (integer) - Сумма кредитов за день
- `count_id` или `new_clients` (integer) - Количество новых клиентов
- `sum_ovrd_sum` или `total_overdue` (integer) - Сумма просрочек за день

---

## 6. Получение ТОП списков клиентов

### Endpoint
```
GET /dashboard/top?sort_by={sort_by}&limit={limit}
```

### Описание
Возвращает список клиентов, отсортированных по указанному критерию.

### Параметры запроса
- `sort_by` (query, required) - Поле для сортировки: `income`, `overdue`, `loans`, `balance`
- `limit` (query, optional) - Количество записей (по умолчанию 5)

### Пример запроса
```http
GET /api/dashboard/top?sort_by=income&limit=5
```

### Пример ответа (200 OK)
```json
[
  {
    "id": "10001",
    "name": "Клиент #10001",
    "incomeValue": 2500000
  },
  {
    "id": "10002",
    "name": "Клиент #10002",
    "incomeValue": 2200000
  },
  {
    "id": "10003",
    "name": "Клиент #10003",
    "incomeValue": 2100000
  }
]
```

### Формат данных для разных sort_by
- `sort_by=income`: поле `incomeValue` (float)
- `sort_by=overdue`: поле `hdb_bki_total_max_overdue_sum` (integer)
- `sort_by=loans`: поле `loanacc_rur_amt_cm_avg` (integer)
- `sort_by=balance`: поле `curr_rur_amt_cm_avg` (integer)

---

## 7. Получение данных сегментации клиентов

### Endpoint
```
GET /dashboard/segmentation
```

### Описание
Возвращает количество клиентов в различных сегментах.

### Пример запроса
```http
GET /api/dashboard/segmentation
```

### Пример ответа (200 OK)
```json
{
  "without_overdue": 14180,
  "new_clients": 3200,
  "risky_clients": 127,
  "total_clients": 15420
}
```

### Поля ответа
- `without_overdue` или `count_no_overdue` (integer) - Клиенты без просрочек (hdb_bki_total_max_overdue_sum == 0)
- `new_clients` или `count_new_clients` (integer) - Новые клиенты (dp_ils_total_seniority < 1)
- `risky_clients` или `count_blacklist` (integer) - Рисковые клиенты (blacklist_flag == 1)
- `total_clients` (integer) - Общее количество клиентов

---

## 8. Получение основных KPI

### Endpoint
```
GET /dashboard/kpi
```

### Описание
Возвращает основные KPI для нового дашборда.

### Пример запроса
```http
GET /api/dashboard/kpi
```

### Пример ответа (200 OK)
```json
{
  "total_clients": 15420,
  "avg_income": 95000,
  "total_loans": 3850000000,
  "risk_clients": 127,
  "avg_credit_score": 782
}
```

### Поля ответа
- `total_clients` или `count_id` (integer) - Всего клиентов
- `avg_income` или `avg_incomeValue` (float) - Средний доход
- `total_loans` или `sum_loanacc_rur_amt_cm_avg` (integer) - Общая сумма кредитов
- `risk_clients` или `count_blacklist_flag` (integer) - Рисковые клиенты (blacklist_flag == 1)
- `avg_credit_score` или `avg_calculated_credit_score` (float) - Средний кредитный скоринг

---

## 9. Получение месячных трендов

### Endpoint
```
GET /dashboard/monthly-trends?months={months}
```

### Описание
Возвращает тренды по месяцам (доходы, кредиты, новые клиенты).

### Параметры запроса
- `months` (query, optional) - Количество месяцев (по умолчанию 12)

### Пример запроса
```http
GET /api/dashboard/monthly-trends?months=12
```

### Пример ответа (200 OK)
```json
[
  {
    "month": "2024-01",
    "dt": "2024-01-01",
    "monthly_income": 1500000000,
    "sum_incomeValue": 1500000000,
    "total_income": 1500000000,
    "monthly_loans": 350000000,
    "sum_loanacc_rur_amt_cm_avg": 350000000,
    "total_loans": 350000000,
    "new_clients": 1200,
    "count_id": 1200,
    "new_clients_count": 1200
  },
  {
    "month": "2024-02",
    "dt": "2024-02-01",
    "monthly_income": 1550000000,
    "sum_incomeValue": 1550000000,
    "total_income": 1550000000,
    "monthly_loans": 365000000,
    "sum_loanacc_rur_amt_cm_avg": 365000000,
    "total_loans": 365000000,
    "new_clients": 1250,
    "count_id": 1250,
    "new_clients_count": 1250
  }
]
```

### Формат данных
- `month` или `dt` или `date` (string) - Месяц в формате YYYY-MM или дата
- `monthly_income` или `sum_incomeValue` или `total_income` (integer) - Сумма доходов за месяц
- `monthly_loans` или `sum_loanacc_rur_amt_cm_avg` или `total_loans` (integer) - Сумма кредитов за месяц
- `new_clients` или `count_id` или `new_clients_count` (integer) - Количество новых клиентов за месяц

---

## 10. Экспорт отчета клиента в PDF

### Endpoint
```
POST /clients/{client_id}/export
```

### Описание
Генерирует и возвращает PDF отчет по клиенту.

### Параметры
- `client_id` (path, required) - ID клиента

### Пример запроса
```http
POST /api/clients/12345/export
Content-Type: application/json
```

### Пример ответа (200 OK)
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="client_report_12345.pdf"

[PDF binary data]
```

### Ошибки
- `404 Not Found` - Клиент не найден
- `500 Internal Server Error` - Ошибка генерации отчета

---

## Общие требования

### Формат ответов
- Все ответы должны быть в формате JSON (кроме PDF экспорта)
- Коды статусов HTTP: 200 (OK), 404 (Not Found), 500 (Internal Server Error)
- При ошибке возвращать JSON с полем `error`:
```json
{
  "error": "Описание ошибки"
}
```

### CORS
Бэкенд должен поддерживать CORS для запросов с фронтенда:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Производительность
- Рекомендуемое время ответа: < 500ms для простых запросов, < 2s для агрегаций
- Для больших датасетов использовать пагинацию

### Версионирование
Если планируется изменение API, использовать версионирование:
```
/api/v1/clients/{client_id}
```

---

## Примеры использования

### Полный цикл работы с клиентом

```javascript
// 1. Получить данные клиента
const clientData = await fetch('/api/clients/12345');
const client = await clientData.json();

// 2. Получить SHAP значения
const shapData = await fetch('/api/clients/12345/shap');
const shapValues = await shapData.json();

// 3. Экспортировать отчет
const reportResponse = await fetch('/api/clients/12345/export', {
  method: 'POST'
});
const blob = await reportResponse.blob();
```

### Загрузка данных дашборда

```javascript
// 1. Основные метрики
const dashboard = await fetch('/api/dashboard');
const dashboardData = await dashboard.json();

// 2. Агрегации
const aggregations = await fetch('/api/dashboard/aggregations');
const aggData = await aggregations.json();

// 3. Динамика
const dynamics = await fetch('/api/dashboard/dynamics?days=30');
const dynamicsData = await dynamics.json();

// 4. ТОП клиенты
const topClients = await fetch('/api/dashboard/top?sort_by=income&limit=5');
const topData = await topClients.json();

// 5. Сегментация
const segmentation = await fetch('/api/dashboard/segmentation');
const segData = await segmentation.json();

// 6. KPI
const kpi = await fetch('/api/dashboard/kpi');
const kpiData = await kpi.json();

// 7. Месячные тренды
const monthlyTrends = await fetch('/api/dashboard/monthly-trends?months=12');
const trendsData = await monthlyTrends.json();
```

---

## 10. Получение персональных рекомендаций (офферов)

### Endpoint
```
GET /clients/{client_id}/offers
```

### Описание
Возвращает персональные рекомендации продуктов банка на основе прогнозируемого дохода клиента.

### Параметры
- `client_id` (path, required) - ID клиента

### Пример запроса
```http
GET /api/clients/12345/offers
```

### Пример ответа (200 OK)
```json
{
  "offers": [
    {
      "id": 1,
      "name": "Alfa Travel Premium",
      "description": "Премиальная карта для путешествий",
      "limit": 375000,
      "category": "premium",
      "isAvailable": true,
      "requirement": "Доход от 150 000 ₽"
    },
    {
      "id": 2,
      "name": "Инвестиционный портфель",
      "description": "Персональные инвестиционные решения",
      "limit": 250000,
      "category": "investment",
      "isAvailable": true,
      "requirement": null
    },
    {
      "id": 3,
      "name": "Кредитная карта 365 дней без %",
      "description": "Беспроцентный период до 365 дней",
      "limit": 312500,
      "category": "credit",
      "isAvailable": true,
      "requirement": null
    }
  ]
}
```

### Поля ответа
- `offers` (array) - Массив рекомендаций
  - `id` (integer) - ID оффера
  - `name` (string) - Название продукта
  - `description` (string) - Описание продукта
  - `limit` (number) - Рассчитанный лимит для клиента
  - `category` (string) - Категория: "premium", "investment", "credit"
  - `isAvailable` (boolean) - Доступен ли продукт для клиента
  - `requirement` (string|null) - Требование для разблокировки (если есть)

### Ошибки
- `404 Not Found` - Клиент не найден
- `500 Internal Server Error` - Ошибка расчета рекомендаций

---

## 11. Симуляция What-If Analysis

### Endpoint
```
POST /clients/{client_id}/simulate
```

### Описание
Выполняет симуляцию изменения параметров клиента и пересчитывает прогнозируемый доход.

### Параметры
- `client_id` (path, required) - ID клиента

### Тело запроса
```json
{
  "debtLoadPercent": 50,
  "monthlySpend": 300000,
  "salaryProject": true,
  "hasDeposit": false
}
```

### Поля запроса
- `debtLoadPercent` (number, 0-100) - Процент кредитной нагрузки
- `monthlySpend` (number) - Транзакции по картам за месяц
- `salaryProject` (boolean) - Наличие зарплатного проекта
- `hasDeposit` (boolean) - Наличие вклада

### Пример запроса
```http
POST /api/clients/12345/simulate
Content-Type: application/json

{
  "debtLoadPercent": 50,
  "monthlySpend": 300000,
  "salaryProject": true,
  "hasDeposit": false
}
```

### Пример ответа (200 OK)
```json
{
  "originalIncome": 125000,
  "newIncome": 152500,
  "delta": 27500,
  "deltaPercent": 22.0,
  "simulationParams": {
    "debtLoadPercent": 50,
    "monthlySpend": 300000,
    "salaryProject": true,
    "hasDeposit": false
  },
  "factors": {
    "debtLoadImpact": 15000,
    "salaryProjectImpact": 18750,
    "monthlySpendImpact": -6250,
    "hasDepositImpact": 0
  }
}
```

### Поля ответа
- `originalIncome` (number) - Исходный прогнозируемый доход
- `newIncome` (number) - Новый прогнозируемый доход после симуляции
- `delta` (number) - Разница между новым и исходным доходом
- `deltaPercent` (number) - Процент изменения
- `simulationParams` (object) - Параметры симуляции
- `factors` (object) - Влияние каждого фактора на изменение дохода

### Ошибки
- `400 Bad Request` - Некорректные параметры симуляции
- `404 Not Found` - Клиент не найден
- `500 Internal Server Error` - Ошибка расчета

---

## Контакты

При возникновении вопросов по API обращайтесь к команде разработки.

