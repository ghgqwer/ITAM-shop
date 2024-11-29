package server

import (
	"backend/pkg"
	"bytes"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

const (
	uniqueCookieKeyName = "uniqueKey"
	codingComplexity    = 32
)

var (
	EncryptCookieKey = []byte("FGHSjgkdtjeod2347kHGDjke732nsdk4")
	EncryptDBKey     = []byte("FGHSjgkdtjeod2347kHGDjke732nsdk4")
)

type User struct {
	ID       string `json:"id"`
	Login    string `json:"login"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

type GetAuthMiddleware struct {
	ExecutorLogin string
}

func (r *Server) authentication() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var authMiddleware GetAuthMiddleware

		bodyBytes, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		if err := json.Unmarshal(bodyBytes, &authMiddleware); err != nil {
			ctx.AbortWithStatus(http.StatusBadRequest)
			return
		}

		ctx.Request.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

		encryptCookieAccessToken, err := ctx.Cookie(uniqueCookieKeyName) //cookie
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in (cookies doesnt exist)"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		cookieAccessKey, err := pkg.Decrypt(encryptCookieAccessToken, EncryptCookieKey)
		if err != nil || len(cookieAccessKey) == 0 {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		var encryptDBAccessToken string
		err = r.usersDB.DB.QueryRow("SELECT acсessToken FROM users WHERE login = $1", authMiddleware.ExecutorLogin).Scan(&encryptDBAccessToken)
		if err != nil {
			log.Printf("Error retrieving access token: %v", err)
			ctx.AbortWithStatus(http.StatusBadRequest)
			return
		}

		dbAccessToken, err := pkg.Decrypt(encryptDBAccessToken, EncryptDBKey)
		if err != nil {
			ctx.AbortWithStatus(http.StatusInternalServerError)
			return
		}

		if cookieAccessKey != dbAccessToken {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "bad Cookies"})
			log.Printf("Tokens not equal %s != %s", encryptCookieAccessToken, dbAccessToken)
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var exist bool
		err = r.usersDB.DB.QueryRow("SELECT EXISTS(SELECT 1 FROM users WHERE login = $1)", authMiddleware.ExecutorLogin).Scan(&exist)
		if err != nil || !exist {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in (dont in db)"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		var isAdmin bool
		err = r.usersDB.DB.QueryRow("SELECT isAdmin FROM users WHERE login = $1", authMiddleware.ExecutorLogin).Scan(&isAdmin)
		if err != nil {
			ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Not logged in (dont in db)"})
			ctx.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		ctx.Set("isAdmin", isAdmin)

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

type PostSignUpUserRequest struct {
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
	var user PostSignUpUserRequest
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

	hashPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	if err = r.usersDB.AddUser(tx, user.Login, user.IsAdmin, hashPassword, user.Balance); err != nil {
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
	err := r.usersDB.DB.QueryRow("SELECT password FROM users WHERE login = $1", postLoginRequest.Login).Scan(&password)
	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(password), []byte(postLoginRequest.Password))
	if err != nil {
		ctx.AbortWithStatus(http.StatusUnauthorized)
		return
	}

	accessToken, err := pkg.GenerateSafeToken(64)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	EncryptСookieAccessToken, err := pkg.Encrypt(accessToken, EncryptCookieKey)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	EncryptDBAccessToken, err := pkg.Encrypt(accessToken, EncryptDBKey)
	if err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
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

	if _, err := tx.Exec("UPDATE users SET acсessToken = $1 WHERE login = $2", EncryptDBAccessToken, postLoginRequest.Login); err != nil {
		ctx.AbortWithStatus(http.StatusBadRequest)
		return
	}

	expirationTime := time.Now().Add(24 * time.Hour)
	cookie := http.Cookie{
		Name:     uniqueCookieKeyName,      //postLoginRequest.Login
		Value:    EncryptСookieAccessToken, //EncryptСookieAccessToken
		Expires:  expirationTime,
		HttpOnly: true,
		Path:     "/",
	}
	http.SetCookie(ctx.Writer, &cookie)

	if err = tx.Commit(); err != nil {
		ctx.AbortWithStatus(http.StatusInternalServerError)
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message":  "User logged in successfully.",
		"username": cookie.Name,
		"isAdmin":  ctx.GetBool("isAdmin"),
	})
}

// Обновить данные пользователя
// sample link: PUT /api/updateUser

type PostUpdateUser struct {
	GetAuthMiddleware
	UserID   string `json:"userID"`
	Password string `json:"password"`
	IsAdmin  bool   `json:"isAdmin"`
	Balance  int    `json:"balance"`
}

// sample Request:
// JSON + Cookie
//
//	{
//		"ExecutorLogin": "Vadim_cvbnqq1",
//		"UserID": "1",
//		"Password": "123",
//		"IsAdmin": true,
//		"Balance": 100000
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

	if err := r.usersDB.UdpateUser(tx, user.ExecutorLogin, user.Password, user.IsAdmin, user.Balance, user.UserID); err != nil {
		log.Printf("Updating user with ID: %s, Login: %s, Balance: %d", user.UserID, user.ExecutorLogin, user.Balance)
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
	GetAuthMiddleware
	UserID string       `json:"userID"`
	Items  []BasketItem `json:"items"`
}

type BasketItem struct {
	ProductID string `json:"productID"`
	Count     int    `json:"count"`
}

// sample Request:
// JSON + Cookie
//
//	{
//	  "ExecutorLogin": "Vadim_cvbnqq1",
//	  "UserID": "1",
//	  "Items": [
//		  {
//			  "ProductID": "2",
//			  "Count": 1
//		  },
//		  {
//			  "ProductID": "3",
//			  "Count": 1
//		  }
//	  ]
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
		basket.UserID).Scan(&user.Login, &user.Balance); err != nil {
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

	_, err = tx.Exec(`UPDATE users SET wallet = $1 WHERE id = $2`, user.Balance, basket.UserID)
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
