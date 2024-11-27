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

func (r *Server) handlerGetProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")
	res, err := r.goodsDB.GetProduct(ID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

// type PostProductRequest struct {
// 	ID          string `json:"id"`
// 	Name        string `json:"name"`
// 	Description string `json:"description"`
// 	Count       string `json:"count"`
// 	Price       string `json:"price"`
// 	IsUnique    bool   `json:"isUnique"`
// 	Category    string `json:"category"`
// }

// type PostProductResponse struct{

// }

type Product struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	Count       string `json:"count"`
	Price       string `json:"price"`
	IsUnique    bool   `json:"isUnique"`
	Category    string `json:"category"`
}

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

func (r *Server) handlerPutProduct(ctx *gin.Context) {
	//ID := ctx.Param("ID")

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

func (r *Server) handlerDeleteProduct(ctx *gin.Context) {
	//ID := ctx.Param("ID")

	var product Product
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

func (r *Server) handlerGetGoods(ctx *gin.Context) {
	res, err := r.goodsDB.GetAllGoods()
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}
