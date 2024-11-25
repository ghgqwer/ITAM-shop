package main

import (
	"backend/internal/database"
	"backend/server"

	_ "github.com/lib/pq"
)

func main() {

	postgresURL := "postgresql://username:password@localhost:5432/core?sslmode=disable"
	db := database.NewDataBase(postgresURL)
	defer db.CloseDataBase()

	serv := server.New(":8080", db)
	serv.StartServer()
}
