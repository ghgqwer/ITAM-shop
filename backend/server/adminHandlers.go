package server

import (
	"backend/internal/database"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

//Добавить товар

// sample link: POST /api/admin/storageProduct

type PostProductRequest struct {
	GetAuthMiddleware
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       []byte
}

// sample Request:
// JSON + Cookie
//
//	{
//		  "ExecutorLogin": "Vadim_cvbnqq1",
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
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	file, err := os.Open(PhotoLink)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	binaryData, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}
	encoded := base64.StdEncoding.EncodeToString(binaryData)

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

	// isAdmin := ctx.GetBool("isAdmin")
	// if !isAdmin {
	// 	ctx.AbortWithStatus(http.StatusForbidden)
	// 	return
	// }

	if err = r.goodsDB.AddProduct(tx, product, encoded); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	var lastProductID string
	err = tx.QueryRow("SELECT id FROM goods WHERE name = $1 ORDER BY id DESC LIMIT 1", product.Name).Scan(&lastProductID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"id": lastProductID})
}

//Обновить данные в товаре

// sample link: PUT /api/admin/storageProduct

type PutProductRequest struct {
	GetAuthMiddleware
	ProductID   string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       []byte
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ExecutorLogin": "Vadim_cvbnqq1",
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

	// isAdmin := ctx.GetBool("isAdmin")
	// if !isAdmin {
	// 	ctx.AbortWithStatus(http.StatusForbidden)
	// 	return
	// }

	file, err := os.Open(PhotoLink)
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	binaryData, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
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

	if err = r.goodsDB.UpdateProduct(tx, product, binaryData); err != nil {
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
	GetAuthMiddleware
	ProductID string
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ExecutorLogin": "Vadim_cvbnqq1",
//		"ProductID": "5"
//	}

func (r *Server) handlerDeleteProduct(ctx *gin.Context) {
	var product DeleteProductRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// isAdmin := ctx.GetBool("isAdmin")
	// if !isAdmin {
	// 	ctx.AbortWithStatus(http.StatusForbidden)
	// 	return
	// }

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
	GetAuthMiddleware
	UserLogin string `json:"userLogin"`
	Coins     int    `json:"coins"`
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ExecutorLogin": "Vadim_cvbnqq1",
//		"UserLogin":"Vadim_cvbnqq2",
//		"Coins":10000
//	}

func (r *Server) handlerAddCoins(ctx *gin.Context) {
	var resCoins ResCoins
	if err := json.NewDecoder(ctx.Request.Body).Decode(&resCoins); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	// isAdmin := ctx.GetBool("isAdmin")
	// if !isAdmin {
	// 	ctx.AbortWithStatus(http.StatusForbidden)
	// 	return
	// }

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
