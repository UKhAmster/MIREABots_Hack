# Руководство по интеграции с бэкендом

## Подключение к API

### 1. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 2. Использование API функций

В компонентах используйте функции из `src/utils/api.js`:

```javascript
import { fetchClientData } from '../utils/api';
import { transformClientData } from '../utils/dataTransform';

// Получение данных клиента
const backendData = await fetchClientData(clientId);
const transformedData = transformClientData(backendData);
```

### 3. Пример интеграции в ClientProfilePage

```javascript
const handleSearch = async () => {
  setIsLoading(true);
  try {
    // Получаем данные с бэкенда
    const backendData = await fetchClientData(clientId);
    
    // Преобразуем в формат для UI
    const transformedData = transformClientData(backendData);
    
    // Добавляем дополнительные поля для отображения
    transformedData.name = `Клиент #${backendData.id}`;
    transformedData.photo = 'https://via.placeholder.com/120';
    
    setClient(transformedData);
    setClientData(transformedData);
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    // Показать уведомление об ошибке
  } finally {
    setIsLoading(false);
  }
};
```

## Структура ответа API

API должен возвращать объект со следующими полями (см. README.md для полного списка):

```json
{
  "id": "12345",
  "age": 35,
  "gender": 1,
  "city_smart_name": "Москва",
  "incomeValue": 125000,
  "incomeValueCategory": "100k_250k",
  "hdb_bki_total_max_limit": 500000,
  ...
}
```

## Преобразование данных

Функция `transformClientData` автоматически:
- Преобразует числовые значения в читаемый формат
- Определяет уровень уверенности модели
- Группирует данные по категориям (БКИ, финансы, риски, активность, стаж)
- Вычисляет средний региональный доход

## Форматирование данных

Используйте утилиты форматирования:

```javascript
import { formatCurrency, formatPercent, formatDate } from '../utils/dataTransform';

formatCurrency(125000); // "125 000 ₽"
formatPercent(0.15);   // "15.0%"
formatDate('2024-01-15'); // "15 января 2024 г."
```

## Обработка ошибок

Все API функции выбрасывают исключения при ошибках:

```javascript
try {
  const data = await fetchClientData(clientId);
} catch (error) {
  // Обработка ошибки (показать уведомление пользователю)
  console.error('Ошибка:', error.message);
}
```

## Тестирование без бэкенда

Для тестирования используйте моки из `src/mockData.js`:

```javascript
import { mockBackendClientData } from '../mockData';
import { transformClientData } from '../utils/dataTransform';

const transformedData = transformClientData(mockBackendClientData);
```

