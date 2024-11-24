package main

import (
	"ITAM-shop/backend/internal/database"
	"ITAM-shop/backend/server"

	_ "github.com/lib/pq"
)

func main() {

	postgresURL := "postgresql://username:password@localhost:5432/core?sslmode=disable"
	db := database.StartDataBase(postgresURL)
	defer db.Close()

	serv := server.New(":8080", db)
	serv.StartServer()
}
