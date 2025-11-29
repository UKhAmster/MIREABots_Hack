# Удаление расчетов с фронтенда

## Изменения

Все расчеты перенесены на бэкенд. Фронтенд теперь только отображает готовые данные.

### 1. Данные клиента (`GET /clients/{client_id}`)

**Добавлены поля в ответ:**
- `confidence` (string) - Уровень уверенности модели: "Высокая", "Средняя", "Низкая"
- `incomeValueCategoryLabel` (string) - Текстовая метка категории дохода
- `averageRegionalIncome` (number) - Средний доход по региону
- `incomeStatus` (string) - Статус дохода: "above", "below", "normal"
- `incomeStatusLabel` (string) - Текстовая метка статуса: "Выше среднего", "Ниже среднего", "В норме"
- `debtLoadPercent` (number) - Процент кредитной нагрузки (0-100)

**Удалено с фронта:**
- `getConfidenceLevel()` - расчет уверенности на основе вероятностей
- `calculateAverageRegionalIncome()` - хардкод средних доходов по городам
- `getIncomeCategoryLabel()` - преобразование категорий дохода
- `getIncomeStatus()` - расчет статуса дохода относительно среднего

### 2. Симуляция What-If Analysis (`POST /clients/{client_id}/simulate`)

**Новый endpoint:**
- Принимает параметры симуляции (debtLoadPercent, monthlySpend, salaryProject, hasDeposit)
- Возвращает пересчитанный доход, delta, влияние факторов

**Удалено с фронта:**
- Логика пересчета дохода в `SimulationPanel.jsx`
- Расчет множителей и бонусов
- Расчет delta (разницы)

**Осталось на фронте:**
- UI состояние (значения слайдеров)
- Debounce для запросов (300ms)
- Отображение результатов

### 3. Персональные рекомендации (`GET /clients/{client_id}/offers`)

**Новый endpoint:**
- Возвращает готовые офферы с рассчитанными лимитами
- Указывает доступность продуктов (`isAvailable`)
- Содержит требования для разблокировки (`requirement`)

**Удалено с фронта:**
- Расчет лимитов на основе дохода (`predictedIncome * multiplier`)
- Проверка доступности премиум продуктов (`predictedIncome >= 150000`)

### 4. Компоненты

**`dataTransform.js`:**
- Убраны функции расчетов
- Осталось только форматирование (`formatCurrency`, `formatPercent`, `formatDate`)
- `getIncomeStatus()` теперь просто возвращает данные с бэка

**`SimulationPanel.jsx`:**
- Убраны `useMemo` для расчетов
- Добавлен вызов API `simulateClient()`
- Добавлен loading state
- Отображает факторы влияния с бэка

**`SmartOffers.jsx`:**
- Убрана проверка `predictedIncome >= 150000`
- Использует `offer.isAvailable` с бэка
- Использует `offer.requirement` для отображения требований

**`ClientHeader.jsx`:**
- Использует готовые `incomeStatus` и `incomeStatusLabel` с бэка
- Расчет прогресс-бара оставлен (только визуализация)

## Что осталось на фронте (в пределах разумного)

1. **Форматирование данных:**
   - `formatCurrency()` - форматирование чисел в валюту
   - `formatPercent()` - форматирование процентов
   - `formatDate()` - форматирование дат

2. **UI состояние:**
   - Значения слайдеров в симуляторе
   - Состояние загрузки
   - Состояние активных вкладок

3. **Визуализация:**
   - Расчет позиций для графиков (Recharts делает это сам)
   - Расчет прогресс-баров (только визуализация, данные с бэка)

4. **Анимации:**
   - Framer Motion анимации
   - Transitions

## API Endpoints

Все endpoints описаны в `API_SPECIFICATION.md`:
- `GET /clients/{client_id}` - данные клиента с расчетными полями
- `POST /clients/{client_id}/simulate` - симуляция What-If Analysis
- `GET /clients/{client_id}/offers` - персональные рекомендации

