package main

import (
	"backend/internal/database"
	"backend/server"

	_ "github.com/lib/pq"
)

func main() {

	postgresURL := "postgresql://username:password@localhost:5432/core?sslmode=disable"
	dbGoods := database.NewDataBase(postgresURL)
	dbUsers := database.UserDataBase(postgresURL)
	defer dbGoods.CloseDataBase()
	defer dbUsers.CloseUsersDataBase()

	serv := server.New(":8080", dbGoods, dbUsers)
	serv.StartServer()
}
