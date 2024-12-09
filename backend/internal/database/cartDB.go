package database

import (
	"database/sql"
	"fmt"
	"log"
)

// DROP TABLE IF EXISTS cart;
const (
	createCartDB = `
	CREATE TABLE IF NOT EXISTS cart (
    id bigserial PRIMARY KEY,
    user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
    product_id TEXT REFERENCES goods(id) ON DELETE CASCADE,
    count INT NOT NULL,
	UNIQUE (user_id, product_id))`

	addInCart = `
	INSERT INTO cart (user_id, product_id, count)
	VALUES ($1, $2, 1)
	ON CONFLICT (user_id, product_id)
	DO UPDATE SET count = cart.count + 1;`

	DeleteFromCart = `DELETE FROM cart WHERE user_id = $1 AND product_id = $2;`

	IncreaseCount = `UPDATE cart SET count = count + 1 WHERE user_id = $1 AND product_id = $2;`

	DecreaseCount = `UPDATE cart SET count = count - 1 WHERE user_id = $1 AND product_id = $2 AND count > 0;`

	GetCartItems = `SELECT product_id, count FROM cart WHERE user_id = $1;`

	GetCartInfoItems = `GetCartItems = 
	SELECT g.id, g.name, g.description, g.count, g.price, g.isUnique, g.category, g.photo, c.count 
	FROM cart AS c 
	JOIN goods AS g ON c.product_id = g.id 
	WHERE c.user_id = $1;`
)

type CartDataBase struct {
	DB *sql.DB
}

func NewCartDataBase(postgresURL string) *CartDataBase {
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("Open: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Ping: %v", err)
	}

	if _, err = db.Exec(createCartDB); err != nil {
		log.Fatalf("failed to create table: %v", err)
	}
	return &CartDataBase{DB: db}
}

func (d *CartDataBase) AddProductInCart(tx *sql.Tx, UserID string, ProductID string) error {
	_, err := tx.Exec(addInCart, UserID, ProductID)
	if err != nil {
		log.Printf("Error add product in cart: %v", err)
		return fmt.Errorf("error add product in cart: %w", err)
	}
	return nil
}

func (d *CartDataBase) InCreaseCountCart(tx *sql.Tx, UserID int, ProductID string) error {
	if _, err := tx.Exec(IncreaseCount, UserID, ProductID); err != nil {
		log.Printf("Error add product in cart: %v", err)
		return fmt.Errorf("error add product in cart: %w", err)
	}
	return nil
}

func (d *CartDataBase) DecreaseCount(tx *sql.Tx, UserID int, ProductID string) error {
	if _, err := tx.Exec(DecreaseCount, UserID, ProductID); err != nil {
		log.Printf("Error Increase product in cart: %v", err)
		return fmt.Errorf("error Increase product in cart: %w", err)
	}
	return nil
}
