package main

import (
	"log"

	"notekeeper/backend/db"
	"notekeeper/backend/internal/auth"
	"notekeeper/backend/internal/middleware"
	"notekeeper/backend/internal/notes"
	"notekeeper/backend/internal/sse"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {

	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using environment variables")
	}

	if err := db.Connect(); err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	log.Println("Connected to PostgreSQL successfully")
	broker := sse.NewBroker()
	broker.Start()
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	authRoutes := r.Group("/auth")
	{
		authRoutes.POST("/register", auth.RegisterHandler)
		authRoutes.POST("/login", auth.LoginHandler)
	}
	noteRoutes := r.Group("/notes")
	noteRoutes.Use(middleware.AuthMiddleware())
	{
		noteRoutes.GET("", notes.GetNotesHandler)
		noteRoutes.POST("", notes.CreateNoteHandler(broker))
		noteRoutes.PUT("/:id", notes.UpdateNoteHandler(broker))
		noteRoutes.DELETE("/:id", notes.DeleteNoteHandler(broker))
		noteRoutes.GET("/stream", sse.StreamHandler(broker))

	}
	r.Run(":8080")

}
