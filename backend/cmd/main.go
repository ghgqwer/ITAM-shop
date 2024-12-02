package main

import (
	"backend/internal/database"
	"backend/server"

	_ "github.com/lib/pq"
)

func main() {
	postgresURL := "postgresql://root:cP0gZTioQbR4pNP5@89.111.154.197:5432/core?sslmode=disable"
	dbGoods := database.NewDataBase(postgresURL)
	dbUsers := database.UserDataBase(postgresURL)
	defer dbGoods.CloseDataBase()
	defer dbUsers.CloseUsersDataBase()

	serv := server.New(":8080", dbGoods, dbUsers)
	serv.StartServer()
}
