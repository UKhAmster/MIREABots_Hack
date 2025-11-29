# Alpha Pred - ML Prediction System

Веб-интерфейс для ML-модели прогнозирования доходов клиентов для хакатона Альфа-Банка.

## Технологический стек

- **React 18** - UI библиотека
- **Vite** - Сборщик и dev-сервер
- **Tailwind CSS** - Стилизация
- **React Router** - Маршрутизация
- **Recharts** - Библиотека графиков
- **Framer Motion** - Анимации
- **Lucide React** - Иконки

## Установка и запуск

1. Установите зависимости:
```bash
npm install
```

2. Запустите dev-сервер:
```bash
npm run dev
```

3. Откройте браузер по адресу `http://localhost:5173`

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Sidebar.jsx     # Боковое меню навигации
│   ├── TopBar.jsx      # Верхняя панель с хлебными крошками
│   ├── Layout.jsx      # Основной layout приложения
│   ├── ClientHeader.jsx    # Карточка профиля клиента
│   ├── ShapChart.jsx      # График SHAP значений
│   ├── ClientDetails.jsx  # Детали цифрового профиля
│   └── SmartOffers.jsx    # Персональные рекомендации
├── pages/              # Страницы приложения
│   ├── ClientProfilePage.jsx  # Страница поиска и профиля клиента
│   ├── DashboardPage.jsx      # Страница мониторинга модели
│   └── SettingsPage.jsx       # Страница настроек
├── utils/               # Утилиты
│   ├── dataTransform.js      # Преобразование данных клиента с бэкенда
│   ├── dashboardTransform.js # Преобразование данных дашборда с бэкенда
│   └── api.js                # API функции для работы с бэкендом
├── mockData.js         # Тестовые данные
├── App.jsx             # Главный компонент с роутингом
├── main.jsx            # Точка входа
└── index.css           # Глобальные стили Tailwind
```

## Структура данных с бэкенда

Приложение ожидает следующие поля от API при запросе данных клиента:

### Базовые данные
- `id` - ID клиента
- `age` - Возраст
- `gender` - Пол (1 - мужской, 0 - женский)
- `city_smart_name` - Город
- `dt` - Дата последней активности
- `dp_ewb_last_employment_position` - Должность

### БКИ данные
- `hdb_bki_total_max_limit` - Максимальный кредитный лимит
- `hdb_bki_total_cnt` - Общее количество кредитных продуктов
- `hdb_bki_total_max_overdue_sum` - Максимальная сумма просрочки
- `hdb_bki_active_cc_max_limit` - Лимит по активным кредитным картам
- `hdb_bki_total_pil_max_limit` - Лимит по потребительским кредитам
- `bki_total_products` - Всего продуктов в БКИ

### Доходы
- `incomeValue` - Значение дохода
- `incomeValueCategory` - Категория дохода
- `curr_rur_amt_cm_avg` - Средний баланс в рублях
- `dp_ils_avg_salary_1y` - Средняя зарплата за 1 год

### Транзакции
- `loanacc_rur_amt_cm_avg` - Средняя сумма кредита
- `turn_cur_cr_sum_v2` - Обороты по кредиту
- `turn_cur_db_sum_v2` - Обороты по дебету
- `mob_cnt_days` - Дни мобильной активности
- `avg_amount_daily_transactions_90d` - Средний дневной оборот

### Риски
- `blacklist_flag` - Наличие в черном списке (0/1)
- `ovrd_sum` - Сумма текущих просрочек
- `label_Below_50k_share_r1` - Вероятность дохода ниже 50к
- `label_Above_1M_share_r1` - Вероятность дохода выше 1М

### Категории трат
- `transaction_category_supermarket_percent_cnt_2m` - Траты в супермаркетах (%)
- `transaction_category_restaurants_percent_cnt_2m` - Траты в ресторанах (%)
- `avg_by_category__amount__sum__cashflowcategory_name__supermarkety` - Супермаркеты (сумма)
- `avg_by_category__amount__sum__cashflowcategory_name__kafe` - Кафе (сумма)

### Стаж работы
- `dp_ils_total_seniority` - Общий стаж работы (месяцы)
- `dp_ils_max_seniority` - Максимальный стаж в одной компании (месяцы)
- `dp_ils_cnt_changes_1y` - Смен работы за 1 год
- `dp_ils_employeers_cnt_last_month` - Работодателей за последний месяц
- `dp_ils_avg_simultanious_jobs_5y` - Одновременных работ за 5 лет

## Структура данных дашборда с бэкенда

API дашборда должен возвращать следующие данные:

### Агрегации по всем записям
- `total_clients` или `count_id` - Всего клиентов
- `avg_income` или `avg_incomeValue` - Средний доход
- `total_loans` или `sum_loanacc_rur_amt_cm_avg` - Общая сумма кредитов
- `avg_age` - Средний возраст
- `blacklist_count` или `count_blacklist_flag` - Клиентов в черном списке
- `total_credit_limit` или `sum_hdb_bki_total_max_limit` - Общий кредитный лимит
- `avg_credits` или `avg_hdb_bki_total_cnt` - Среднее количество кредитов
- `total_overdue` или `sum_hdb_bki_total_max_overdue_sum` - Общая сумма просрочек
- `clients_with_overdue` или `count_overdue` - Клиенты с просрочками

### Динамика по датам (массив объектов)
Каждый объект содержит:
- `dt` или `date` - Дата
- `sum_incomeValue` или `total_income` - Сумма доходов за день
- `sum_loanacc_rur_amt_cm_avg` или `total_loans` - Сумма кредитов за день
- `count_id` или `new_clients` - Количество новых клиентов
- `sum_ovrd_sum` или `total_overdue` - Сумма просрочек за день

### Сегментация
- `without_overdue` или `count_no_overdue` - Клиенты без просрочек
- `new_clients` или `count_new_clients` - Новые клиенты (стаж < 1 месяца)
- `risky_clients` or `count_blacklist` - Рисковые клиенты (в черном списке)

### ТОП списки (массивы объектов)
Каждый объект содержит:
- `id` - ID клиента
- `name` - Имя клиента (опционально)
- Поле значения в зависимости от типа:
  - `incomeValue` - для ТОП по доходам
  - `hdb_bki_total_max_overdue_sum` - для ТОП по просрочкам
  - `loanacc_rur_amt_cm_avg` - для ТОП по кредитам
  - `curr_rur_amt_cm_avg` - для ТОП по балансам

### Дополнительные метрики
- `avg_mob_total_sessions` или `avg_mobile_activity` - Средняя мобильная активность
- `sum_supermarket` или `sum_transaction_category_supermarket_sum_amt_d15` - Траты в супермаркетах
- `avg_cafe` или `avg_by_category__amount__sum__cashflowcategory_name__kafe` - Средние траты в кафе
- `count_investing` или `count_vert_has_app_ru_tinkoff_investing` - Пользователи инвестиций
- `sum_current_overdue` или `sum_ovrd_sum_positive` - Сумма текущих просрочек
- `avg_low_income_prob` или `avg_label_Below_50k_share_r1` - Средняя вероятность низкого дохода
- `count_large_overdue` или `count_hdb_bki_total_max_overdue_sum_large` - Крупные просрочки (>10к)

### Основные KPI (новый дашборд)
- `total_clients` или `count_id` - Всего клиентов
- `avg_income` или `avg_incomeValue` - Средний доход
- `total_loans` или `sum_loanacc_rur_amt_cm_avg` - Общая сумма кредитов
- `risk_clients` или `count_blacklist_flag` - Рисковые клиенты (в черном списке)
- `avg_credit_score` или `avg_calculated_credit_score` - Средний кредитный скоринг

### Месячные тренды (массив объектов)
Каждый объект содержит:
- `month` или `dt` или `date` - Месяц (формат YYYY-MM или дата)
- `monthly_income` или `sum_incomeValue` или `total_income` - Сумма доходов за месяц
- `monthly_loans` или `sum_loanacc_rur_amt_cm_avg` или `total_loans` - Сумма кредитов за месяц
- `new_clients` или `count_id` или `new_clients_count` - Количество новых клиентов за месяц

## Интеграция с бэкендом

Для подключения к реальному API:

1. Создайте файл `.env` в корне проекта:
```env
VITE_API_BASE_URL=http://localhost:8000
```

2. Используйте функции из `src/utils/api.js`:
```javascript
import { fetchClientData } from '../utils/api';
import { transformClientData } from '../utils/dataTransform';
import { transformAggregations, transformDynamics } from '../utils/dashboardTransform';

// Данные клиента
const clientData = await fetchClientData(clientId);
const transformedData = transformClientData(clientData);

// Данные дашборда
const aggregations = await fetchBankAggregations();
const transformedAggregations = transformAggregations(aggregations);

const dynamics = await fetchDynamics(30);
const transformedDynamics = transformDynamics(dynamics);
```

3. Компоненты автоматически адаптируются к данным с бэкенда благодаря функции `transformClientData`.

## Основные функции

### 1. Поиск клиента
- Ввод ID клиента
- Отображение профиля с предсказанным доходом
- Визуальные индикаторы относительно среднего дохода по региону

### 2. Мониторинг модели (Расширенный дашборд)
- **Основные метрики модели**: WMAE, количество предсказаний, средний доход, uptime
- **Агрегации по банку**: 
  - Всего клиентов, средний доход, общая сумма кредитов
  - Общий кредитный лимит, среднее количество кредитов
  - Клиенты в черном списке, клиенты с просрочками
- **Динамика по датам**: 
  - Динамика доходов и кредитов
  - Новые клиенты и просрочки
- **Сегментация клиентов**: 
  - Без просрочек, новые клиенты, рисковые клиенты
- **ТОП списки**: 
  - ТОП-5 по доходам, просрочкам, кредитам, балансам
- **Дополнительные метрики**: 
  - Мобильная активность, траты в супермаркетах и кафе
  - Пользователи инвестиций, текущие просрочки
  - Вероятность низкого дохода, крупные просрочки
- График изменения точности модели (WMAE) за 30 дней
- Распределение предсказанных доходов по сегментам

### 3. Интерпретируемость (SHAP)
- Горизонтальный бар-чарт с факторами влияния
- Визуализация повышающих и понижающих факторов

### 4. Бизнес-ценность
- Персональные рекомендации продуктов
- Динамический расчет лимитов на основе прогноза
- Кнопка экспорта отчета

## Дизайн-система

- **Основной цвет**: #EF3124 (Alpha Red)
- **Фон**: #F3F4F6 (Light Gray)
- **Стиль**: Clean Corporate с тенями и закругленными углами

## Документация для бэкенд разработчиков

Для интеграции с бэкендом предоставьте разработчикам следующие документы:

1. **API_SPECIFICATION.md** - Полная спецификация всех API endpoints с примерами запросов и ответов
2. **BACKEND_REQUIREMENTS.md** - Краткие требования к бэкенду с приоритетами реализации

Эти документы содержат:
- Список всех необходимых endpoints
- Форматы запросов и ответов
- Структуру данных для каждого endpoint
- Примеры SQL запросов для агрегаций
- Технические требования (CORS, производительность, обработка ошибок)

## Примечания

- Все данные сейчас используют моки из `mockData.js`
- Функция `transformClientData` в `src/utils/dataTransform.js` преобразует данные с бэкенда в формат для UI
- Компоненты поддерживают как новый формат данных (из бэкенда), так и старый (для обратной совместимости)
- Экспорт PDF реализован через API функцию `exportClientReport` в `src/utils/api.js`

