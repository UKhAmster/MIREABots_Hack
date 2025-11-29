# 🐳 Запуск через Docker

## Быстрый старт

### Вариант 1: Makefile (рекомендуется)

```bash
# Собрать и запустить
make build
make up

# Или одной командой
make rebuild
```

### Вариант 2: Скрипт

```bash
./docker-start.sh
```

### Вариант 3: Docker Compose напрямую

```bash
# Сборка
docker-compose build

# Запуск
docker-compose up -d

# Проверка
docker-compose ps
```

## Доступные команды Makefile

```bash
make help      # Показать все команды
make build     # Собрать образы
make up        # Запустить сервисы
make down      # Остановить сервисы
make restart   # Перезапустить
make logs      # Показать логи всех сервисов
make logs-api  # Логи Go API
make logs-ml   # Логи ML Service
make health    # Проверить здоровье сервисов
make test      # Протестировать API
make clean     # Удалить контейнеры и volumes
make rebuild   # Пересобрать и запустить
make status    # Статус контейнеров
```

## Эндпоинты

После запуска доступны:

- **ML Service**: http://localhost:8000
  - Health: `GET http://localhost:8000/health`

- **Go API**: http://localhost:8080
  - Health: `GET http://localhost:8080/api/health`
  - Predict: `POST http://localhost:8080/api/predict`

- **PostgreSQL**: localhost:5432
  - User: postgres
  - Password: postgres
  - Database: postgres

## Тестирование

```bash
# Health checks
curl http://localhost:8000/health
curl http://localhost:8080/api/health

# Predict
curl -X POST http://localhost:8080/api/predict \
  -H "Content-Type: application/json" \
  -d '{"client_id": 1}'
```

Или используйте Makefile:
```bash
make test
```

## Остановка

```bash
make down
# или
docker-compose down
```

## Логи

```bash
# Все логи
make logs

# Конкретный сервис
make logs-api
make logs-ml
make logs-db

# Или напрямую
docker-compose logs -f api
docker-compose logs -f ml-service
```

## Пересборка

Если изменили код:

```bash
make rebuild
```

Это удалит старые контейнеры, пересоберет образы и запустит заново.

## Troubleshooting

### Порт занят
```bash
# Проверить что использует порт
lsof -i :8080
lsof -i :8000
lsof -i :5432

# Остановить контейнеры
make down
```

### Ошибка при сборке ML Service
ML Service требует много времени для установки catboost (~99MB).
Dockerfile уже настроен с увеличенными таймаутами.

Если всё равно падает:
1. Проверьте интернет-соединение
2. Попробуйте собрать только ML Service: `docker-compose build ml-service`
3. Используйте локальный запуск для разработки

### Сервисы не отвечают
```bash
# Проверить статус
make status

# Проверить логи
make logs

# Перезапустить
make restart
```

## Структура сервисов

```
┌─────────────┐
│   Go API    │ :8080
│  (Backend)  │
└──────┬──────┘
       │
       ├───→ ML Service :8000 (Python/FastAPI)
       │
       └───→ PostgreSQL :5432
```

## Переменные окружения

Можно изменить в `docker-compose.yml`:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `ML_SERVICE_URL`
- `PORT`

