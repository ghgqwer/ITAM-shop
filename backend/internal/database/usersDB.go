package database

import (
	"database/sql"
	"fmt"
	"log"
)

const (
	//DELETE FROM users;
	//DROP TABLE IF EXISTS users;
	// DROP TABLE IF EXISTS cart;
	// DROP TABLE IF EXISTS users;
	//DELETE FROM users WHERE login = '*';
	//UPDATE users SET isAdmin = TRUE WHERE login = 'taisiidemidowa@yandex.ru';
	createUsersDB = `
	CREATE TABLE IF NOT EXISTS users (
	id TEXT PRIMARY KEY, 
	login TEXT,
	password BYTEA, 
	isAdmin BOOL, 
	wallet INT,
	acсessToken TEXT)` //,acсessToken BYTEA

	addUser = `INSERT INTO users (id, login, password, isAdmin, wallet) 
	VALUES ($1, $2, $3, $4, $5)`

	updateUser = `UPDATE users SET login = $1, password = $2, isAdmin = $3, wallet = $4 
	WHERE id = $5` //to rewrite login, password, adm, wall

	addCoins = `UPDATE users SET wallet = wallet + $1 WHERE id = $2`

	addCoinsByLogin = `UPDATE users SET wallet = wallet + $1 WHERE login = $2`

	GetUserBalance = `SELECT wallet FROM users WHERE login = $1;`
)

type UsersDataBase struct {
	DB *sql.DB
}

type Credentials struct {
	ID       string
	Login    string
	Password string
	IsAdmin  bool
}

type User struct {
	Info    Credentials
	Balance int
}

func UserDataBase(postgresURL string) *UsersDataBase {
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("Open: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Ping: %v", err)
	}

	if _, err = db.Exec(createUsersDB); err != nil {
		log.Fatalf("failed to create table: %v", err)
	}
	return &UsersDataBase{DB: db}
}

func (d *UsersDataBase) AddUser(tx *sql.Tx, id string, login string, isAdmin bool, password []byte, balance int) error {
	//isAdmin := false
	_, err := tx.Exec(addUser, id, login, password,
		isAdmin, balance)
	if err != nil {
		log.Printf("Error adding user: %v", err)
		return fmt.Errorf("failed to add user: %w", err)
	}
	return nil
}

func (d *UsersDataBase) UdpateUser(tx *sql.Tx, login, password string, isAdmin bool, balance int, id string) error {
	if _, err := tx.Exec(updateUser,
		login, password, isAdmin, balance, id); err != nil {
		return fmt.Errorf("User doesnt update: %w", err)
	}
	return nil
}

func (d *UsersDataBase) AddCoins(tx *sql.Tx, coins int, id string) error {
	if _, err := tx.Exec(addCoins, coins, id); err != nil {
		return fmt.Errorf("coins dont add: %w", err)
	}
	return nil
}

func (d *UsersDataBase) AddCoinsByLogin(tx *sql.Tx, coins int, login string) error {
	if _, err := tx.Exec(addCoinsByLogin, coins, login); err != nil {
		return fmt.Errorf("coins dont add: %w", err)
	}
	return nil
}

func (d *UsersDataBase) CheckUserBalance(login string) error {
	if _, err := d.DB.Exec(GetUserBalance, login); err != nil {
		return fmt.Errorf("coins dont add: %w", err)
	}
	return nil
}

func (d *UsersDataBase) CloseUsersDataBase() {
	if err := d.DB.Close(); err != nil {
		log.Printf("error closing users database: %v", err)
	}
}
