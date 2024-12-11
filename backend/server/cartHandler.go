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

	if err := r.cartDB.InCreaseCountCart(tx, ctx.GetString("userID"), putIncreaesCountRequest.ProductID); err != nil {
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

	if err := r.cartDB.DecreaseCount(tx, ctx.GetString("userID"), putDecreaesCountRequest.ProductID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.Status(http.StatusOK)
}

type DeleteProductFromCartRequest struct {
	ProductID string `json:"productID"`
}

func (r *Server) handlerDeteleProductFromCart(ctx *gin.Context) {
	var productID DeleteProductFromCartRequest

	if err := json.NewDecoder(ctx.Request.Body).Decode(&productID); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if productID.ProductID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ProductID is required"})
		return
	}

	tx, err := r.cartDB.DB.Begin()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to start transaction"})
		return
	}

	defer func() {
		if err != nil {
			tx.Rollback()
			return
		}
	}()

	userId := ctx.GetString("userID")
	if userId == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "UserID is required"})
		return
	}

	log.Printf("Trying to delete product with ID: %s for user: %s", productID.ProductID, userId)

	if err := r.cartDB.DeleteProductFromCart(tx, userId, productID.ProductID); err != nil {
		log.Printf("Error deleting product from cart: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product from cart"})
		return
	}

	if err = tx.Commit(); err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to commit transaction"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

func (r *Server) handlerCheckCart(ctx *gin.Context) {
	userId := ctx.GetString("userID")
	rows, err := r.cartDB.DB.Query(database.GetCartItems, userId)
	if err != nil {
		log.Printf("Error retrieving cart items: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not retrieve cart items"})
		return
	}
	defer rows.Close()

	var cartItems []struct {
		ProductID string `json:"product_id"`
		Count     int    `json:"count"`
	}

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

	if err := rows.Err(); err != nil {
		log.Printf("Error during row iteration: %v", err)
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching cart items"})
		return
	}

	var products []database.Product
	for _, cartItem := range cartItems {
		product, err := r.goodsDB.GetProduct(cartItem.ProductID)
		if err != nil {
			log.Printf("Error retrieving product with ID %s: %v", cartItem.ProductID, err)
			continue
		}

		product.Count = cartItem.Count
		products = append(products, product)
	}

	ctx.JSON(http.StatusOK, products)
}
