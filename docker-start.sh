#!/bin/bash

# Цвета
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}MireaBots - Docker запуск${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Проверка Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker не установлен${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose не установлен${NC}"
    exit 1
fi

# Функция для проверки здоровья сервиса
check_health() {
    local url=$1
    local name=$2
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            echo -e "${GREEN}✅ $name готов!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Ожидание $name... ($attempt/$max_attempts)${NC}"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "${RED}❌ $name не ответил за отведенное время${NC}"
    return 1
}

# Остановка предыдущих контейнеров
echo -e "${YELLOW}Остановка предыдущих контейнеров...${NC}"
docker-compose down 2>/dev/null

# Сборка образов
echo ""
echo -e "${GREEN}Сборка Docker образов...${NC}"
if ! docker-compose build; then
    echo -e "${RED}❌ Ошибка при сборке образов${NC}"
    exit 1
fi

# Запуск сервисов
echo ""
echo -e "${GREEN}Запуск сервисов...${NC}"
docker-compose up -d

# Ожидание готовности
echo ""
echo -e "${YELLOW}Ожидание готовности сервисов...${NC}"
sleep 5

# Проверка здоровья
echo ""
check_health "http://localhost:8000/health" "ML Service"
check_health "http://localhost:8080/api/health" "Go API"

# Итоговый статус
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Статус сервисов:${NC}"
echo -e "${GREEN}========================================${NC}"
docker-compose ps

echo ""
echo -e "${GREEN}Эндпоинты:${NC}"
echo "  ML Service:  http://localhost:8000"
echo "  Go API:      http://localhost:8080"
echo ""
echo -e "${GREEN}Тест:${NC}"
echo '  curl -X POST http://localhost:8080/api/predict \'
echo '    -H "Content-Type: application/json" \'
echo '    -d '"'"'{"client_id": 1}'"'"''
echo ""
echo -e "${YELLOW}Логи:${NC}"
echo "  docker-compose logs -f"
echo ""
echo -e "${YELLOW}Остановка:${NC}"
echo "  docker-compose down"
echo "  или: make down"
echo ""

