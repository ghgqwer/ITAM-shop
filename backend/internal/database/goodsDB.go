package database

import (
	"database/sql"
	"fmt"
	"log"
)

type Product struct {
	ProductID   string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       []byte
}

const (
	CreateDB = `CREATE TABLE IF NOT EXISTS goods (
	id bigserial PRIMARY KEY, 
	name TEXT,
	description TEXT, 
	count INT, 
	price INT, 
	isUnique BOOL, 
	category TEXT,
	photo BYTEA)`

	Add = `INSERT INTO goods (name, description, count, price, isUnique, category, photo) 
	VALUES ($1, $2, $3, $4, $5, $6, $7)`

	Delete = `DELETE FROM goods WHERE id = $1`

	Udpate = `UPDATE goods SET name = $1, description = $2, count = $3, 
	price = $4, isUnique = $5, category = $6, photo = $7 WHERE id = $8`

	Get = `SELECT * FROM goods WHERE id = $1;`

	GetGoods = `SELECT * FROM goods`
)

type GoodsDataBase struct {
	DB *sql.DB
}

func NewDataBase(postgresURL string) *GoodsDataBase {
	db, err := sql.Open("postgres", postgresURL)
	if err != nil {
		log.Fatalf("Open: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("Ping: %v", err)
	}

	if _, err = db.Exec(CreateDB); err != nil {
		log.Fatalf("failed to create table: %v", err)
	}
	return &GoodsDataBase{DB: db}
}

func (d *GoodsDataBase) AddProduct(tx *sql.Tx, product Product, photo []byte) error {
	_, err := tx.Exec(Add, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo)
	if err != nil {
		log.Printf("Error adding product: %v", err)
		return fmt.Errorf("failed to add product: %w", err)
	}
	return nil
}

func (d *GoodsDataBase) DeleteProduct(tx *sql.Tx, id string) error {
	if _, err := tx.Exec(Delete, id); err != nil {
		return fmt.Errorf("Product doesnt delete: %w", err)
	}
	return nil
}

func (d *GoodsDataBase) UpdateProduct(tx *sql.Tx, product Product, photo []byte) error {
	if _, err := tx.Exec(Udpate, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo, product.ProductID); err != nil {
		return fmt.Errorf("Product doesnt update: %w", err)
	}
	return nil
}

func (d *GoodsDataBase) GetProduct(id string) (Product, error) {
	var product Product
	err := d.DB.QueryRow(Get, id).Scan(&product.ProductID, &product.Name,
		&product.Description, &product.Count, &product.Price,
		&product.IsUnique, &product.Category, &product.Photo)
	if err != nil {
		return product, fmt.Errorf("Product doesnt get %w", err)
	}
	return product, nil
}

func (d *GoodsDataBase) GetAllGoods() ([]Product, error) {
	var products []Product

	rows, err := d.DB.Query(GetGoods)
	if err != nil {
		log.Printf("Error fetching goods: %v", err)
		return nil, fmt.Errorf("failed to fetch goods: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		err := rows.Scan(&product.ProductID, &product.Name, &product.Description,
			&product.Count, &product.Price, &product.IsUnique,
			&product.Category, &product.Photo)
		if err != nil {
			log.Printf("Error scanning product: %v", err)
			return nil, fmt.Errorf("failed to scan product: %w", err)
		}
		products = append(products, product)
	}
	return products, nil
}

func (d *GoodsDataBase) CloseDataBase() {
	if err := d.DB.Close(); err != nil {
		log.Printf("error closing goods database: %v", err)
	}
}
