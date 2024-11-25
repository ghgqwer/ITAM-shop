package database

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
)

type Product struct {
	ID          string
	Name        string
	Description string
	Count       string
	Price       string
	IsUnique    bool
	Category    string
	Photo       []byte
}

type Storage struct {
	Products []Product
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

type DataBase struct {
	DB *sql.DB
}

func NewDataBase(postgresURL string) *DataBase {
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
	return &DataBase{DB: db}
}

func (d *DataBase) AddProduct(product Product, photo []byte) error {
	_, err := d.DB.Exec(Add, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo)
	if err != nil {
		log.Printf("Error adding product: %v", err)
		return fmt.Errorf("failed to add product: %w", err)
	}
	return nil
}

func (d *DataBase) DeleteProduct(id string) error {
	if _, err := d.DB.Exec(Delete, id); err != nil {
		return fmt.Errorf("Product doesnt delete: %w", err)
	}
	return nil
}

func (d *DataBase) UpdateProduct(product Product, ID string, photo []byte) error {
	if _, err := d.DB.Exec(Udpate, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo, ID); err != nil {
		return errors.New("Product doesnt update")
	}
	return nil
}

func (d *DataBase) GetProduct(id string) (Product, error) {
	var product Product
	err := d.DB.QueryRow(Get, id).Scan(&product.ID, &product.Name,
		&product.Description, &product.Count, &product.Price,
		&product.IsUnique, &product.Category, &product.Photo)
	if err != nil {
		return product, fmt.Errorf("Product doesnt get %w", err)
	}
	return product, nil
}

func (d *DataBase) GetAllGoods() ([]Product, error) {
	var products []Product

	rows, err := d.DB.Query(GetGoods)
	if err != nil {
		log.Printf("Error fetching goods: %v", err)
		return nil, fmt.Errorf("failed to fetch goods: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		err := rows.Scan(&product.ID, &product.Name, &product.Description,
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

func (d *DataBase) CloseDataBase() {
	if err := d.DB.Close(); err != nil {
		log.Printf("Error closing database: %w", err)
	}
}
