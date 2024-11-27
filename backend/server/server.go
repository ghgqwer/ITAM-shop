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

	authUsers := engine.Group("/api", r.authentication())
	deafultUsers := engine.Group("/api")

	deafultUsers.GET("/product/:ID", r.handlerGetProduct) // sample - /api/product/:ID
	deafultUsers.GET("/products", r.handlerGetGoods)

	deafultUsers.POST("/signUp", r.handlerSignUpUser)
	deafultUsers.POST("/login", r.handlerLoginUser)

	authUsers.PUT("/updateUser", r.handlerUpdateUser)
	authUsers.PUT("/basket/buy", r.handlerBuyBasket)

	authUsers.POST("/admin/storageProduct", r.handlerPostProduct)
	authUsers.PUT("/admin/storageProduct", r.handlerPutProduct)
	authUsers.DELETE("/admin/storageProduct", r.handlerDeleteProduct)
	authUsers.PUT("/admin/addCoins", r.handlerAddCoins)

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

// 	photoData := res.Photo

// 	fileName := fmt.Sprintf("photo_%s.png", ID)
// 	err = os.WriteFile(fileName, photoData, 0644)
// 	if err != nil {
// 		ctx.AbortWithStatus(http.StatusInternalServerError)
// 		return
// 	}

// 	ctx.JSON(http.StatusOK, res)
// }
