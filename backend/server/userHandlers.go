package server

import (
	"database/sql"
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

const (
	uniqueCookieKeyName = "uniqueKey"
	uniqueCookieKey     = "uniqueKey123"
)

type User struct {
	ID       string `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

func (r *Server) authentication() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		cookie, err := ctx.Cookie(uniqueCookieKeyName)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in (cookies doesnt exist)"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		if cookie != uniqueCookieKey {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "bad Cookie"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var exist bool
		err = r.usersDB.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE login = $1)", cookie).Scan(&exist)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in (dont in db)"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		ctx.Next()
	}
}

func (r *Server) handlerCheckCookie(ctx *gin.Context) {
	cookie, err := ctx.Cookie(uniqueCookieKeyName)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"message": "Cookie not found",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"value":   cookie,
		"isAdmin": ctx.GetBool("isAdmin"),
	})
}

// Регистрация пользователя
// sample link: POST /api/signUp

type PostUserRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

// sample Request:
// JSON
//	{
//		"Login": "Vadim_cvbnqq",
//		"Password": "123",
//		"isAdmin": false,
//		"Balance": 10000
//	}

func (r *Server) handlerSignUpUser(ctx *gin.Context) {
	var user PostUserRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&user); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	var count int
	if err := r.usersDB.DB.QueryRow("SELECT COUNT(*) FROM users WHERE login = $1", user.Login).Scan(&count); err != nil {
		log.Printf("Error querying user count: %v", err)
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if count > 0 {
		ctx.AbortWithStatus(http.StatusConflict)
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

// Авторизация пользователя
// sample link: POST /api/login

type PostLoginRequest struct {
	Login    string
	Password string
	IsAdmin  bool
}

// sample Request:
// JSON
//	{
//		"Login": "Vadim_cvbnqq",
//		"Password": "123"
//	}

type PostLoginResponse struct {
	http.Cookie
}

// sample Response: Cookie

func (r *Server) handlerLoginUser(ctx *gin.Context) {
	var postLoginRequest PostLoginRequest
	if err := json.NewDecoder(ctx.Request.Body).Decode(&postLoginRequest); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	var password string
	if err := r.usersDB.DB.QueryRow("SELECT password FROM users WHERE login = $1", postLoginRequest.Login).Scan(&password); err != nil || password != postLoginRequest.Password {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	cookie := http.Cookie{
		Name:     uniqueCookieKeyName,
		Value:    uniqueCookieKey,
		Expires:  expirationTime,
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(ctx.Writer, &cookie)
	ctx.Set("isAdmin", postLoginRequest.IsAdmin)

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "User logged in successfully.",
		"username": cookie.Name,
		"isAdmin":  ctx.GetBool("isAdmin"),
	})
}

// Обновить данные пользователя
// sample link: PUT /api/updateUser

type PostUpdateUser struct {
	ID       string `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

// sample Request:
// JSON + Cookie
//	{
//		"ID": "6",
//		"Login": "Vadim_cvbnqq",
//		"Password": "123",
//		"isAdmin": true,
//		"Balance": 10
//	}

func (r *Server) handlerUpdateUser(ctx *gin.Context) {
	var user PostUpdateUser
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

// Купить содержимое корзины
// sample link: PUT /api/basket/buy

type PutBuyBasketResponse struct {
	ID    string       `json:"id"`
	Items []BasketItem `json:"items"`
}

type BasketItem struct {
	ProductID string `json:"productID"`
	Count     int    `json:"count"`
}

// sample Request:
// JSON + Cookie
//	{
//	    "ID": "1",
//	    "Items": [
//	        {
//	            "ProductID": "3",
//	            "Count": 1
//	        },
//	        {
//	            "ProductID": "4",
//	            "Count": 2
//	        }
//	    ]
//	}

func (r *Server) handlerBuyBasket(ctx *gin.Context) {
	var basket PutBuyBasketResponse
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

// Добавление коинов пользователю
// sample link: PUT /api/admin/addCoins

type ResCoins struct {
	ID    string `json:"id"`
	Coins int    `json:"coins"`
}

// sample Request:
// JSON + Cookie
//	{
//		"ID":"3",
//		"Coins":10000
//	}

func (r *Server) handlerAddCoins(ctx *gin.Context) {
	var resCoins ResCoins
	if err := json.NewDecoder(ctx.Request.Body).Decode(&resCoins); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
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

	if err := r.usersDB.AddCoins(tx, resCoins.Coins, resCoins.ID); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	if err := tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}
}
