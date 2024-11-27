package server

import (
	"backend/internal/database"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// Получить один товар по ID
// sample link: GET /api/product/{ID}

type GetProductResponse struct {
	ID          string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       []byte
}

// sample Response:
// JSON
//
//	{
//		"ID": "5",
//		"Name": "T-shirt",
//		"Description": "Cool t-shirst",
//		"Count": 2,
//		"Price": 10,
//		"IsUnique": false,
//		"Category": "clothes",
//		"Photo": binary Photo
//	}

func (r *Server) handlerGetProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")
	res, err := r.goodsDB.GetProduct(ID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

//Добавить товар

// sample link: POST /api/admin/storageProduct

type PostProductRequest struct {
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
//		"Name": "T-shirt",
//		"Description": "Cool t-shirst",
//		"Count": 2,
//		"Price": 10,
//		"IsUnique": false,
//		"Category": "clothes",
//		"Photo": binary Photo
//	}

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

	if err = r.goodsDB.AddProduct(tx, product, binaryData); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

//Обновить данные в товаре

// sample link: PUT /api/admin/storageProduct

type PutProductRequest struct {
	ID          string
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
//	{
//		"ID": "6",
//		"Name": "T-shirt",
//		"Description": "Very cool T-shirt",
//		"Count": 4,
//		"Price": 20,
//		"IsUnique": true,
//		"Category": "clothes"
//	}

func (r *Server) handlerPutProduct(ctx *gin.Context) {
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

	_, err = r.goodsDB.GetProduct(product.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
			return
		}
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve product"})
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
	ID string
}

// sample Request:
// JSON + Cookie
// {
// 		"ID": "2"
// }

func (r *Server) handlerDeleteProduct(ctx *gin.Context) {
	var product DeleteProductRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
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

	if err := r.goodsDB.DeleteProduct(tx, product.ID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

//Получить список всех товаров

// sample link: GET /api/products

type GetAllProductsResponse struct {
	AllProducts []GetProductResponse
}

// sample Response:
// JSON
// [
// 	{
// 		"ID": "5",
// 		"Name": "T-shirt",
// 		"Description": "Cool t-shirst",
// 		"Count": 2,
// 		"Price": 10,
// 		"IsUnique": false,
// 		"Category": "clothes",
// 		"Photo": binary Photo
// 	},
// 		{
// 		"ID": "5",
// 		"Name": "T-shirt",
// 		"Description": "Cool t-shirst",
// 		"Count": 2,
// 		"Price": 10,
// 		"IsUnique": false,
// 		"Category": "clothes",
// 		"Photo": binary Photo
// 	}
// ]

func (r *Server) handlerGetGoods(ctx *gin.Context) {
	res, err := r.goodsDB.GetAllGoods()
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}
