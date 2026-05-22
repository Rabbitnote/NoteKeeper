package auth

import (
	"context"
	"errors"
	"notekeeper/backend/db"
	"notekeeper/backend/internal/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"golang.org/x/crypto/bcrypt"
)

func Register(ctx context.Context, email, password, name string) (*models.User, error) {

	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	var user models.User

	err = db.Pool.QueryRow(ctx, `INSERT INTO users(email, password, name)
	 VALUES($1, $2, $3)
	  RETURNING id, email, name, created_at, updated_at`,
		email, hashed, name).
		Scan(&user.ID, &user.Email, &user.Name, &user.CreatedAt, &user.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil

}

func Login(ctx context.Context, email, password string) (string, error) {
	var user models.User

	err := db.Pool.QueryRow(ctx,
		`SELECT id, email, password, name FROM users WHERE email = $1`, email).
		Scan(&user.ID, &user.Email, &user.Password, &user.Name)
	if err != nil {
		return "", errors.New("Invalid email or password")
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil {
		return "", errors.New("Invalid email or password")
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"email":   user.Email,
		"name":    user.Name,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	secret := os.Getenv("JWT_SECRET")
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
