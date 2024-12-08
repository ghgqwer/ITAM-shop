package server

//127.0.0.1
import (
	"backend/internal/database"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const (
	PhotoLink = "./images/sampleTshirt.jpg"
	//PhotoLink = "../images/sampleTshirt.jpg"
)

type Server struct {
	host    string
	goodsDB *database.GoodsDataBase
	usersDB *database.UsersDataBase
	cartDB  *database.CartDataBase
}

func New(host string, dbGoods *database.GoodsDataBase, dbUsers *database.UsersDataBase, dbCart *database.CartDataBase) *Server { //
	s := &Server{
		host:    host,
		goodsDB: dbGoods,
		usersDB: dbUsers,
		cartDB:  dbCart,
	}
	return s
}

func (r *Server) newApi() *gin.Engine {
	engine := gin.New()

	// engine.Use(cors.New(cors.Config{
	// 	AllowAllOrigins: true,
	// 	//		AllowOrigins:     []string{"http://localhost:5173"}, // Разрешите доступ для этого источника
	// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
	// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
	// 	ExposeHeaders:    []string{"Content-Length"},
	// 	AllowCredentials: true,
	// 	MaxAge:           12 * time.Hour,
	// }))
	engine.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	engine.GET("/health", func(ctx *gin.Context) {
		ctx.Status(200)
	})

	authUsers := engine.Group("/api", r.authentication()) //, r.authentication()
	deafultUsers := engine.Group("/api")

	deafultUsers.GET("/product/:ID", r.handlerGetProduct)
	deafultUsers.GET("/products", r.handlerGetGoods)

	deafultUsers.POST("/signUp", r.handlerSignUpUser)
	deafultUsers.POST("/login", r.handlerLoginUser)

	authUsers.PUT("/updateUser", r.handlerUpdateUser)
	authUsers.PUT("/basket/buy", r.handlerBuyBasket)

	//admin
	authUsers.POST("/admin/storageProduct", r.handlerPostProduct)
	authUsers.PUT("/admin/storageProduct", r.handlerPutProduct)
	authUsers.DELETE("/admin/storageProduct", r.handlerDeleteProduct)
	authUsers.PUT("/admin/addCoins", r.handlerAddCoins)

	//cart
	authUsers.POST("/addInCart", r.handlerPostCart)
	authUsers.PUT("/increaseProductCart", r.handlerPutIncreaseCount)
	authUsers.PUT("/decreaseProductCart", r.handlerPutDecreaseCount)
	authUsers.GET("/checkCart", r.handlerCheckCart)

	//test endpoint
	authUsers.GET("/checkCookie", r.handlerCheckCookie)
	return engine
}

func (r *Server) StartServer() {
	r.newApi().Run(r.host)
}

// engine.Use(cors.New(cors.Config{

// 	AllowAllOrigins: true,
// 	// AllowOrigins: []string{"http://example.com"},
// 	AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
// 	AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
// 	ExposeHeaders:    []string{"Content-Length"},
// 	AllowCredentials: true,
// 	MaxAge:           12 * time.Hour,
// }))

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
