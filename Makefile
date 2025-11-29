.PHONY: help build up down restart logs test clean

# Цвета для вывода
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
RESET  := $(shell tput -Txterm sgr0)

help: ## Показать справку
	@echo "$(GREEN)MireaBots - Docker команды$(RESET)"
	@echo ""
	@echo "Доступные команды:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(RESET) %s\n", $$1, $$2}'

build: ## Собрать Docker образы
	@echo "$(GREEN)Сборка Docker образов...$(RESET)"
	docker-compose build

up: ## Запустить все сервисы
	@echo "$(GREEN)Запуск сервисов...$(RESET)"
	docker-compose up -d
	@echo "$(GREEN)Ожидание готовности сервисов...$(RESET)"
	@sleep 5
	@make health

down: ## Остановить все сервисы
	@echo "$(YELLOW)Остановка сервисов...$(RESET)"
	docker-compose down

restart: ## Перезапустить все сервисы
	@make down
	@make up

logs: ## Показать логи всех сервисов
	docker-compose logs -f

logs-api: ## Показать логи Go API
	docker-compose logs -f api

logs-ml: ## Показать логи ML Service
	docker-compose logs -f ml-service

logs-db: ## Показать логи PostgreSQL
	docker-compose logs -f postgres

health: ## Проверить здоровье сервисов
	@echo "$(GREEN)Проверка сервисов...$(RESET)"
	@echo ""
	@echo "ML Service:"
	@curl -s http://localhost:8000/health | python3 -m json.tool 2>/dev/null || echo "  ❌ Не доступен"
	@echo ""
	@echo "Go API:"
	@curl -s http://localhost:8080/api/health | python3 -m json.tool 2>/dev/null || echo "  ❌ Не доступен"

test: ## Протестировать API
	@echo "$(GREEN)Тестирование API...$(RESET)"
	@echo ""
	@echo "Health Check:"
	@curl -s http://localhost:8080/api/health | python3 -m json.tool
	@echo ""
	@echo "Predict Test:"
	@curl -s -X POST http://localhost:8080/api/predict \
		-H "Content-Type: application/json" \
		-d '{"client_id": 1}' | python3 -m json.tool | head -20

clean: ## Удалить контейнеры и volumes
	@echo "$(YELLOW)Удаление контейнеров и volumes...$(RESET)"
	docker-compose down -v
	docker system prune -f

rebuild: ## Пересобрать и запустить
	@make clean
	@make build
	@make up

status: ## Показать статус контейнеров
	docker-compose ps

stop: ## Остановить контейнеры (alias для down)
	@make down

start: ## Запустить контейнеры (alias для up)
	@make up

