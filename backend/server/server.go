package server

import (
	"ITAM-shop/backend/internal/database"
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

type Server struct {
	host string
	db   *sql.DB
}

func New(host string, db *sql.DB) *Server {
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
	res, err := database.GetProduct(r.db, ID)
	if err != nil {
		ctx.AbortWithStatus(400)
		return
	}
	ctx.JSON(200, res)
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

	file, err := os.Open("../images/temp_image_1864F5A8-BB50-48B2-9D6A-39291A775AB2.WEBP")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	binaryData, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}

	if err := database.AddProduct(r.db, product, binaryData); err != nil {
		ctx.JSON(500, gin.H{"error": err.Error()})
		return
	}

	ctx.Status(http.StatusOK)
}

func (r *Server) handlerPutProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")

	var product database.Product
	if err := json.NewDecoder(ctx.Request.Body).Decode(&product); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	file, err := os.Open("../images/temp_image_1864F5A8-BB50-48B2-9D6A-39291A775AB2.WEBP")
	if err != nil {
		log.Fatal(err)
	}
	defer file.Close()

	binaryData, err := io.ReadAll(file)
	if err != nil {
		log.Fatal(err)
	}

	if err := database.UpdateProduct(r.db, product, ID, binaryData); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.Status(http.StatusOK)
}

func (r *Server) handlerDeleteProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")
	if err := database.DeleteProduct(r.db, ID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.Status(http.StatusOK)
}

func (r *Server) handlerGetGoods(ctx *gin.Context) {
	res, err := database.GetAllGoods(r.db)
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

func (r *Server) StartServer() {
	r.newApi().Run(r.host)
}
