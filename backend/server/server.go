package server

import (
	"backend/internal/database"

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

	point := engine.Group("/api", r.authentication())

	engine.GET("/product/:ID", r.handlerGetProduct) // sample - /api/product/:ID
	engine.GET("/products", r.handlerGetGoods)

	engine.POST("/api/signUp", r.handlerSignUpUser)
	engine.POST("/apilogin", r.handlerLoginUser)

	point.PUT("/updateUser", r.handlerUpdateUser)
	point.PUT("/basket/buy", r.handlerBuyBasket)

	point.POST("/admin/storageProduct", r.handlerPostProduct)
	point.PUT("/admin/storageProduct", r.handlerPutProduct)
	point.DELETE("/admin/storageProduct", r.handlerDeleteProduct)
	point.PUT("/admin/addCoins", r.handlerAddCoins)

	//test endpoint
	engine.GET("/checkCookie", r.handlerCheckCookie)

	return engine
}

func (r *Server) StartServer() {
	r.newApi().Run(r.host)
}

// func (r *Server) handlerGetProduct(ctx *gin.Context) {
// 	ID := ctx.Param("ID")
// 	res, err := r.goodsDB.GetProduct(ID)
// 	if err != nil {
// 		ctx.AbortWithStatus(http.StatusBadRequest)
// 		return
// 	}

// 	// photoData теперь предположительно уже в байтовом формате
// 	photoData := res.Photo

// 	// Сохраняем изображение в файл
// 	fileName := fmt.Sprintf("photo_%s.png", ID)
// 	err = os.WriteFile(fileName, photoData, 0644) // Права доступа 0644
// 	if err != nil {
// 		ctx.AbortWithStatus(http.StatusInternalServerError)
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, res)
// }
