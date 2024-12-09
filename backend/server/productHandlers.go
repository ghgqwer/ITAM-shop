package server

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Получить один товар по ID
// sample link: GET /api/product/{ID}

type GetProductResponse struct {
	ProductID   string
	Name        string
	Description string
	Count       int
	Price       int
	IsUnique    bool
	Category    string
	Photo       string
}

// sample Response:
// JSON
//
//	{
//		"ProductID": "5",
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

//Получить список всех товаров

// sample link: GET /api/products

type GetAllProductsResponse struct {
	AllProducts []GetProductResponse
}

// sample Response:
// JSON
// [
// 	{
// 		"ProductID": "5",
// 		"Name": "T-shirt",
// 		"Description": "Cool t-shirst",
// 		"Count": 2,
// 		"Price": 10,
// 		"IsUnique": false,
// 		"Category": "clothes",
// 		"Photo": binary Photo
// 	},
// 		{
// 		"ProductID": "5",
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

// // Проверяем, существует ли поле Photo
// if res.Photo != "" {
// 	// Путь для сохранения изображения
// 	photoFilePath := fmt.Sprintf("./%s.jpg", res.ProductID)

// 	// Декодируем изображение из Base64
// 	decodedPhoto, err := base64.StdEncoding.DecodeString(res.Photo)
// 	if err != nil {
// 		log.Printf("Error decoding photo: %v", err)
// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not decode photo"})
// 		return
// 	}

// 	// Сохраняем изображение декодированными данными в файл
// 	err = os.WriteFile(photoFilePath, decodedPhoto, 0644) // сохраняем декодированные данные из Photo
// 	if err != nil {
// 		log.Printf("Error saving photo: %v", err)
// 		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Could not save photo"})
// 		return
// 	}

// 	log.Printf("Photo saved successfully: %s", photoFilePath)
// }
