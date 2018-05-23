package handlers

import (
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetMe(userId *string) *events.APIGatewayProxyResponse {

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		log.Println("User not yet in database: " + *userId)
		user = db.GetDb().RegisterNewUser(userId)
	}

	data := &models.Update{Users: []*models.User{user}}
	return lib.BuildUpdate(data)
}
