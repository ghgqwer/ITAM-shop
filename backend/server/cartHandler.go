package server

import (
	"backend/internal/database"
	"encoding/json"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

type PostCartRequest struct {
	ProductID string
}

func (r *Server) handlerPostCart(ctx *gin.Context) {
	var postCartRequest PostCartRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&postCartRequest); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	tx, err := r.cartDB.DB.Begin()
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

	userId := ctx.GetString("executorLogin")
	if userId == "" {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := r.cartDB.AddProductInCart(tx, ctx.GetString("userID"), postCartRequest.ProductID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

type PutChangeCountRequest struct {
	ProductID string
}

func (r *Server) handlerPutIncreaseCount(ctx *gin.Context) {
	var putIncreaesCountRequest PutChangeCountRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&putIncreaesCountRequest); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	tx, err := r.cartDB.DB.Begin()
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

	if err := r.cartDB.InCreaseCountCart(tx, ctx.GetInt("userID"), putIncreaesCountRequest.ProductID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

func (r *Server) handlerPutDecreaseCount(ctx *gin.Context) {
	var putDecreaesCountRequest PutChangeCountRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&putDecreaesCountRequest); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	tx, err := r.cartDB.DB.Begin()
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

	if err := r.cartDB.DecreaseCount(tx, ctx.GetInt("userID"), putDecreaesCountRequest.ProductID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

func (r *Server) handlerCheckCart(ctx *gin.Context) {
	userId := ctx.GetString("userID")
	log.Printf("%d", userId)
	// Запрашиваем товары в корзине текущего пользователя
	rows, err := r.cartDB.DB.Query(database.GetCartItems, userId)
	if err != nil {
		log.Printf("Error retrieving cart items: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve cart items"})
		return
	}
	defer rows.Close()

	// Массив для хранения товаров в корзине
	var cartItems []struct {
		ProductID string `json:"product_id"`
		Count     int    `json:"count"`
	}

	// Перебираем результаты и добавляем их в массив
	for rows.Next() {
		var item struct {
			ProductID string `json:"product_id"`
			Count     int    `json:"count"`
		}
		if err := rows.Scan(&item.ProductID, &item.Count); err != nil {
			log.Printf("Error scanning row: %v", err)
			ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not scan cart item"})
			return
		}
		cartItems = append(cartItems, item)
	}

	// Проверка на наличие ошибок после завершения итерации
	if err := rows.Err(); err != nil {
		log.Printf("Error during row iteration: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cart items"})
		return
	}

	// Теперь необходимо получить информацию о каждом товаре по его ProductID
	var products []database.Product
	for _, cartItem := range cartItems {
		product, err := r.goodsDB.GetProduct(cartItem.ProductID)
		if err != nil {
			log.Printf("Error retrieving product with ID %s: %v", cartItem.ProductID, err)
			continue // Игнорируем продукт, если он не найден
		}

		// Добавляем детали продукта в ответ
		product.Count = cartItem.Count // Устанавливаем количество товара из корзины
		products = append(products, product)
	}

	// Возвращаем информацию о товарах в корзине
	ctx.JSON(http.StatusOK, products)
}
