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


### Вариант 2: Docker Compose напрямую

```bash
# Сборка
docker-compose build

# Запуск
docker-compose up -d

# Проверка
docker-compose ps
```

