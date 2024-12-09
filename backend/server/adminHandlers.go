package server

import (
	"backend/internal/database"
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

//Добавить товар

// sample link: POST /api/admin/storageProduct

type PostProductRequest struct {
	//GetAuthMiddleware
	ProductID   string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       string
}

// sample Request:
// JSON + Cookie
//
//	{
//		  "Name": "T-shirt",
//		  "Description": "Cool t-shirst",
//		  "Count": 100,
//		  "Price": 10,
//		  "IsUnique": false,
//		  "Category": "clothes"
//		  "Photo": пока без фото
//	  }

func (r *Server) handlerPostProduct(ctx *gin.Context) {
	var product database.Product
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON payload"})
		return
	}

	tx, err := r.goodsDB.DB.Begin()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not start transaction: " + err.Error()})
		return
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		}
	}()

	isAdmin := ctx.GetBool("isAdmin")
	if !isAdmin {
		ctx.AbortWithStatus(http.StatusForbidden)
		return
	}

	if err = r.goodsDB.AddProduct(tx, product); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Could not add product: " + err.Error()}) //http.StatusBadRequest
		return
	}

	var lastProductID string
	err = tx.QueryRow("SELECT id FROM goods WHERE name = $1 ORDER BY id DESC LIMIT 1", product.Name).Scan(&lastProductID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve last product ID: " + err.Error()})
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not commit transaction: " + err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"id": lastProductID})
}

//Обновить данные в товаре

// sample link: PUT /api/admin/storageProduct

type PutProductRequest struct {
	//GetAuthMiddleware
	ProductID   string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       string
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ProductID": "4",
//		"Name": "T-shirt",
//		"Description": "Very very cool T-shirt",
//		"Count": 4,
//		"Price": 20,
//		"IsUnique": true,
//		"Category": "clothes"
//		"Photo": пока без фото
//	}

func (r *Server) handlerPutProduct(ctx *gin.Context) {
	var product database.Product
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	isAdmin := ctx.GetBool("isAdmin")
	if !isAdmin {
		ctx.AbortWithStatus(http.StatusForbidden)
		return
	}

	tx, err := r.goodsDB.DB.Begin()
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}
	}()

	_, err = r.goodsDB.GetProduct(product.ProductID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve product"})
		log.Printf("%v", err)
		return
	}

	if err = r.goodsDB.UpdateProduct(tx, product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

//Удалить товар

// sample link: DELETE /api/admin/storageProduct

type DeleteProductRequest struct {
	//GetAuthMiddleware
	ProductID string
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ProductID": "5"
//	}

func (r *Server) handlerDeleteProduct(ctx *gin.Context) {
	var product DeleteProductRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	isAdmin := ctx.GetBool("isAdmin")
	if !isAdmin {
		ctx.AbortWithStatus(http.StatusForbidden)
		return
	}

	tx, err := r.goodsDB.DB.Begin()
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}
	}()

	if err := r.goodsDB.DeleteProduct(tx, product.ProductID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

// Добавление коинов пользователю
// sample link: PUT /api/admin/addCoins

type ResCoins struct {
	//GetAuthMiddleware
	UserLogin string `json:"userLogin"`
	Coins     int    `json:"coins"`
}

// sample Request:
// JSON + Cookie
//
//	{
//		"UserLogin":"Vadim_cvbnqq2",
//		"Coins":10000
//	}

func (r *Server) handlerAddCoins(ctx *gin.Context) {
	var resCoins ResCoins
	if err := json.NewDecoder(ctx.Request.Body).Decode(&resCoins); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	isAdmin := ctx.GetBool("isAdmin")
	if !isAdmin {
		ctx.AbortWithStatus(http.StatusForbidden)
		return
	}

	tx, err := r.usersDB.DB.Begin()
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}
	}()

	if err := r.usersDB.AddCoinsByLogin(tx, resCoins.Coins, resCoins.UserLogin); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
}

// // // Открытие файла с изображением
// file, err := os.Open(PhotoLink)
// if err != nil {
// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not open image file: " + err.Error()})
// 	return
// }
// defer file.Close()

// // Чтение бинарных данных из файла
// binaryData, err := io.ReadAll(file)
// if err != nil {
// 	ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not read image file: " + err.Error()})
// 	return
// }
// encoded := base64.StdEncoding.EncodeToString(binaryData)
// product.Photo = encoded
