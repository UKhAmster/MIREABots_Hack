# MireaBots API

Backend API для прогнозирования дохода клиентов.

## Архитектура

- **Go API** (порт 8080) - основной backend сервис
- **Python ML Service** (порт 8000) - ML-модель для прогнозирования
- **PostgreSQL** (порт 5432) - база данных

## Быстрый старт с Docker

### Запуск всего стека (API + ML Service + PostgreSQL)

```bash
docker-compose up --build
```

Серверы будут доступны:
- Go API: `http://localhost:8080`
- ML Service: `http://localhost:8000`
- PostgreSQL: `localhost:5432`

### Остановка

```bash
docker-compose down
```

### Остановка с удалением данных БД

```bash
docker-compose down -v
```

## Тестирование API

### Health check

```bash
curl http://localhost:8080/api/health
```

### Прогноз дохода клиента

```bash
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d '{"client_id": 1}'
```

## Переменные окружения

### Go API сервис:
- `DB_HOST` - хост БД (по умолчанию: localhost)
- `DB_PORT` - порт БД (по умолчанию: 5432)
- `DB_USER` - пользователь БД (по умолчанию: postgres)
- `DB_PASSWORD` - пароль БД (по умолчанию: postgres)
- `DB_NAME` - имя БД (по умолчанию: postgres)
- `ML_SERVICE_URL` - URL ML-сервиса (по умолчанию: http://localhost:8000)
- `PORT` - порт API сервера (по умолчанию: 8080)

### Локальный запуск без Docker:

1. Запустить ML-сервис:
```bash
cd ds/MIREABots_Hack/ds_service
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 8000
```

2. Запустить PostgreSQL (или использовать существующий)

3. Запустить Go API:
```bash
export ML_SERVICE_URL=http://localhost:8000
./mireabots-api
```

## Структура проекта

```
.
├── main.go                 # Точка входа
├── internal/
│   ├── handlers/          # HTTP handlers
│   ├── models/            # Модели данных
│   ├── database/          # Подключение к БД
│   └── ml/                # Интеграция с ML-моделью
├── Dockerfile
├── docker-compose.yml
└── init.sql               # SQL схема БД
```

