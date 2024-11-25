package user

type Credentials struct {
	ID       string
	Login    string
	Password string
	isAdmin  bool
}

type Balance struct {
	Count int
}

type User struct {
	Info   Credentials
	Wallet Balance
}
