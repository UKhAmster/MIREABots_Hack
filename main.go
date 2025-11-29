package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"mireabots-api/internal/handlers"
	"mireabots-api/internal/database"
)

func main() {
	// Инициализация подключения к БД
	db, err := database.InitDB()
	if err != nil {
		log.Printf("Warning: Failed to connect to database: %v", err)
		log.Printf("Running in mock mode - using mock data for testing")
		db = nil // Позволим работать без БД для тестирования
	} else {
		defer db.Close()
		log.Println("Database connection established")
	}

	// Создание роутера
	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Инициализация handlers
	predictHandler := handlers.NewPredictHandler(db)

	// Маршруты
	api := r.Group("/api")
	{
		api.POST("/predict", predictHandler.Predict)
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		})
	}

	// Получение порта из переменной окружения или использование дефолтного
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

