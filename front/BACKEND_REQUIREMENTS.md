# Требования к бэкенду для Alpha Pred

## Краткое описание

Фронтенд приложения ожидает REST API с следующими endpoints для работы с данными клиентов и дашбордом мониторинга модели.

## Список необходимых endpoints

### Клиенты

1. **GET /api/clients/{client_id}** - Получение данных клиента
2. **GET /api/clients/{client_id}/shap** - Получение SHAP значений
3. **POST /api/clients/{client_id}/export** - Экспорт отчета в PDF

### Дашборд

4. **GET /api/dashboard** - Общие метрики модели
5. **GET /api/dashboard/aggregations** - Агрегации по банку
6. **GET /api/dashboard/dynamics?days=30** - Динамика по датам
7. **GET /api/dashboard/top?sort_by={field}&limit=5** - ТОП списки
8. **GET /api/dashboard/segmentation** - Сегментация клиентов
9. **GET /api/dashboard/kpi** - Основные KPI
10. **GET /api/dashboard/monthly-trends?months=12** - Месячные тренды

## Приоритеты реализации

### Высокий приоритет (MVP)
1. GET /api/clients/{client_id} - критично для основной функциональности
2. GET /api/dashboard/kpi - для основного дашборда
3. GET /api/dashboard/monthly-trends - для графиков трендов

### Средний приоритет
4. GET /api/clients/{client_id}/shap - для интерпретируемости
5. GET /api/dashboard/aggregations - для расширенного дашборда
6. GET /api/dashboard/dynamics - для динамики
7. GET /api/dashboard/segmentation - для сегментации

### Низкий приоритет
8. GET /api/dashboard/top - для ТОП списков
9. GET /api/dashboard - для общих метрик модели
10. POST /api/clients/{client_id}/export - экспорт PDF

## Структура данных клиента

Все поля из датасета должны быть доступны в ответе `/api/clients/{client_id}`:

### Обязательные поля
- `id` - ID клиента
- `age` - Возраст
- `gender` - Пол (1 - мужской, 0 - женский)
- `city_smart_name` - Город
- `incomeValue` - Предсказанный доход
- `incomeValueCategory` - Категория дохода

### БКИ данные
- `hdb_bki_total_max_limit` - Максимальный кредитный лимит
- `hdb_bki_total_cnt` - Количество кредитных продуктов
- `hdb_bki_total_max_overdue_sum` - Максимальная сумма просрочки
- `hdb_bki_active_cc_max_limit` - Лимит по активным КК
- `hdb_bki_total_pil_max_limit` - Лимит по потребительским кредитам
- `bki_total_products` - Всего продуктов в БКИ

### Финансы
- `curr_rur_amt_cm_avg` - Средний баланс
- `dp_ils_avg_salary_1y` - Средняя зарплата за год
- `loanacc_rur_amt_cm_avg` - Средняя сумма кредита
- `turn_cur_cr_sum_v2` - Обороты по кредиту
- `turn_cur_db_sum_v2` - Обороты по дебету

### Риски
- `blacklist_flag` - В черном списке (0/1)
- `ovrd_sum` - Текущие просрочки
- `label_Below_50k_share_r1` - Вероятность дохода < 50к
- `label_Above_1M_share_r1` - Вероятность дохода > 1М

### Активность
- `mob_cnt_days` - Дни мобильной активности
- `avg_amount_daily_transactions_90d` - Средний дневной оборот
- `transaction_category_supermarket_percent_cnt_2m` - Траты в супермаркетах (%)
- `transaction_category_restaurants_percent_cnt_2m` - Траты в ресторанах (%)
- `avg_by_category__amount__sum__cashflowcategory_name__supermarkety` - Супермаркеты (сумма)
- `avg_by_category__amount__sum__cashflowcategory_name__kafe` - Кафе (сумма)

### Стаж работы
- `dp_ils_total_seniority` - Общий стаж (месяцы)
- `dp_ils_max_seniority` - Макс. стаж в одной компании (месяцы)
- `dp_ils_cnt_changes_1y` - Смен работы за год
- `dp_ils_employeers_cnt_last_month` - Работодателей за месяц
- `dp_ils_avg_simultanious_jobs_5y` - Одновременных работ за 5 лет

### Дополнительно
- `dt` - Дата последней активности
- `dp_ewb_last_employment_position` - Должность

## Агрегации для дашборда

### Основные KPI
```sql
SELECT 
  COUNT(id) as total_clients,
  AVG(incomeValue) as avg_income,
  SUM(loanacc_rur_amt_cm_avg) as total_loans,
  COUNT(CASE WHEN blacklist_flag = 1 THEN 1 END) as risk_clients,
  AVG(calculated_credit_score) as avg_credit_score
FROM clients
```

### Месячные тренды
```sql
SELECT 
  DATE_TRUNC('month', dt) as month,
  SUM(incomeValue) as monthly_income,
  SUM(loanacc_rur_amt_cm_avg) as monthly_loans,
  COUNT(id) as new_clients
FROM clients
GROUP BY DATE_TRUNC('month', dt)
ORDER BY month DESC
LIMIT 12
```

### Динамика по дням
```sql
SELECT 
  dt as date,
  SUM(incomeValue) as total_income,
  SUM(loanacc_rur_amt_cm_avg) as total_loans,
  COUNT(id) as new_clients,
  SUM(ovrd_sum) as total_overdue
FROM clients
WHERE dt >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY dt
ORDER BY dt
```

### Сегментация
```sql
SELECT 
  COUNT(CASE WHEN hdb_bki_total_max_overdue_sum = 0 THEN 1 END) as without_overdue,
  COUNT(CASE WHEN dp_ils_total_seniority < 1 THEN 1 END) as new_clients,
  COUNT(CASE WHEN blacklist_flag = 1 THEN 1 END) as risky_clients,
  COUNT(*) as total_clients
FROM clients
```

## Технические требования

### Формат ответов
- JSON для всех endpoints (кроме PDF)
- Кодировка: UTF-8
- Content-Type: application/json

### Обработка ошибок
- 200 OK - успешный запрос
- 404 Not Found - ресурс не найден
- 500 Internal Server Error - ошибка сервера

Формат ошибки:
```json
{
  "error": "Описание ошибки"
}
```

### CORS
Необходимо настроить CORS для работы с фронтендом:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Производительность
- Простые запросы: < 500ms
- Агрегации: < 2s
- Для больших выборок использовать пагинацию

### Кэширование (опционально)
Рекомендуется кэшировать:
- Агрегации по банку (TTL: 5-10 минут)
- Месячные тренды (TTL: 1 час)
- KPI (TTL: 5 минут)

## Тестирование

Для тестирования можно использовать mock данные из файла `src/mockData.js` в репозитории фронтенда.

## Документация API

Полная спецификация API находится в файле `API_SPECIFICATION.md`.

## Вопросы?

При возникновении вопросов обращайтесь к команде фронтенда.

