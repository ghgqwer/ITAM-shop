package database

import (
	"database/sql"
	"errors"
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

func StartDataBase(postgresURL string) *sql.DB {
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
	return db
}

func AddProduct(db *sql.DB, product Product, photo []byte) error {
	_, err := db.Exec(Add, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo)
	if err != nil {
		log.Printf("Error adding product: %v", err)
		return errors.New("failed to add product")
	}
	return nil
}

func DeleteProduct(db *sql.DB, id string) error {
	if _, err := db.Exec(Delete, id); err != nil {
		return errors.New("Product doesnt delete")
	}
	return nil
}

func UpdateProduct(db *sql.DB, product Product, ID string, photo []byte) error {
	if _, err := db.Exec(Udpate, product.Name, product.Description, product.Count, product.Price,
		product.IsUnique, product.Category, photo, ID); err != nil {
		return errors.New("Product doesnt update")
	}
	return nil
}

func GetProduct(db *sql.DB, id string) (Product, error) {
	var product Product
	err := db.QueryRow(Get, id).Scan(&product.ID, &product.Name,
		&product.Description, &product.Count, &product.Price,
		&product.IsUnique, &product.Category, &product.Photo)
	if err != nil {
		return product, errors.New("Product doesnt get")
	}
	return product, nil
}

func GetAllGoods(db *sql.DB) ([]Product, error) {
	var products []Product

	rows, err := db.Query(GetGoods)
	if err != nil {
		log.Printf("Error fetching goods: %v", err)
		return nil, errors.New("failed to fetch goods")
	}
	defer rows.Close()

	for rows.Next() {
		var product Product
		err := rows.Scan(&product.ID, &product.Name, &product.Description,
			&product.Count, &product.Price, &product.IsUnique,
			&product.Category, &product.Photo)
		if err != nil {
			log.Printf("Error scanning product: %v", err)
			return nil, errors.New("failed to scan product")
		}
		products = append(products, product)
	}
	return products, nil
}
