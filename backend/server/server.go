package server

import (
	"backend/internal/database"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

const (
	PhotoLink = "../images/temp_image_1864F5A8-BB50-48B2-9D6A-39291A775AB2.WEBP"
)

type Server struct {
	host string
	db   *database.DataBase
}

func New(host string, db *database.DataBase) *Server {
	s := &Server{
		host: host,
		db:   db,
	}

	return s
}

func (r *Server) newApi() *gin.Engine {
	engine := gin.New()

	engine.GET("/health", func(ctx *gin.Context) {
		ctx.Status(200)
	})

	engine.GET("/product/:ID", r.handlerGetProduct)
	engine.POST("/admin/storageProduct", r.handlerPostProduct)
	engine.PUT("/admin/storageProduct/:ID", r.handlerPutProduct)
	engine.DELETE("/admin/storageProduct/:ID", r.handlerDeleteProduct)
	engine.GET("/products", r.handlerGetGoods)
	return engine
}

func (r *Server) handlerGetProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")
	res, err := r.db.GetProduct(ID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

type Product struct {
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

	tx, err := r.db.DB.Begin()
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

	if err = r.db.AddProduct(product, binaryData); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

// 	if err := r.db.AddProduct(product, binaryData); err != nil {
// 		ctx.JSON(500, gin.H{"error": err.Error()})
// 		return
// 	}

// 	ctx.Status(http.StatusOK)
// }

func (r *Server) handlerPutProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")

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

	tx, err := r.db.DB.Begin()
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

	if err = r.db.UpdateProduct(product, ID, binaryData); err != nil {
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
	ID := ctx.Param("ID")

	tx, err := r.db.DB.Begin()
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

	if err := r.db.DeleteProduct(ID); err != nil {
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
	res, err := r.db.GetAllGoods()
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

func (r *Server) StartServer() {
	r.newApi().Run(r.host)
}
