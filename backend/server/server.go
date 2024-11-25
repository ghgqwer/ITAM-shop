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

const (
	PhotoLink = "../images/temp_image_1864F5A8-BB50-48B2-9D6A-39291A775AB2.WEBP"
)

type Server struct {
	host    string
	goodsDB *database.GoodsDataBase
	usersDB *database.UsersDataBase
}

func New(host string, dbGoods *database.GoodsDataBase, dbUsers *database.UsersDataBase) *Server {
	s := &Server{
		host:    host,
		goodsDB: dbGoods,
		usersDB: dbUsers,
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
	engine.PUT("/admin/storageProduct", r.handlerPutProduct)
	engine.DELETE("/admin/storageProduct", r.handlerDeleteProduct)
	engine.GET("/products", r.handlerGetGoods)

	engine.POST("/login", r.handlerLoginUser)
	engine.PUT("/updateUser", r.handlerUpdateUser)
	engine.PUT("/basket/buy", r.handlerBuyBasket)
	return engine
}

func (r *Server) handlerGetProduct(ctx *gin.Context) {
	ID := ctx.Param("ID")
	res, err := r.goodsDB.GetProduct(ID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}
	ctx.JSON(http.StatusOK, res)
}

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

type User struct {
	ID       string `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

func (r *Server) handlerLoginUser(ctx *gin.Context) {
	var user User
	if err := json.NewDecoder(ctx.Request.Body).Decode(&user); err != nil {
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

	if err = r.usersDB.AddUser(tx, user.Login, user.Password, user.Balance); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

func (r *Server) handlerUpdateUser(ctx *gin.Context) {
	var user User
	if err := json.NewDecoder(ctx.Request.Body).Decode(&user); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
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

	if err := r.usersDB.UdpateUser(tx, user.Login, user.Password, user.IsAdmin, user.Balance, user.ID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

type Basket struct {
	ID    string       `json:"id"`
	Items []BasketItem `json:"items"`
}

type BasketItem struct {
	ProductID string `json:"productID"`
	Count     int    `json:"count"`
}

func (r *Server) handlerBuyBasket(ctx *gin.Context) {
	var basket Basket
	if err := json.NewDecoder(ctx.Request.Body).Decode(&basket); err != nil {
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

	var user User
	if err := r.usersDB.DB.QueryRow("SELECT login, wallet FROM users WHERE id = $1",
		basket.ID).Scan(&user.Login, &user.Balance); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	totalPrice := 0

	for _, item := range basket.Items {
		product, err := r.goodsDB.GetProduct(item.ProductID)
		if err != nil {
			if errors.Is(err, sql.ErrNoRows) {
				ctx.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
				return
			}
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve product"})
			return
		}

		if product.Count < item.Count {
			ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not enough product available"})
			return
		}

		totalPrice += product.Price * item.Count
	}

	if user.Balance < totalPrice {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Not enough coins"})
		return
	}

	user.Balance -= totalPrice

	_, err = tx.Exec(`UPDATE users SET wallet = $1 WHERE id = $2`, user.Balance, basket.ID)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	for _, item := range basket.Items {
		_, err := tx.Exec(`UPDATE goods SET count = count - $1 WHERE id = $2`, item.Count, item.ProductID)
		if err != nil {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)

}

func (r *Server) StartServer() {
	r.newApi().Run(r.host)
}
