package handlers

import (
	"encoding/json"
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetMe(userId *string) *events.APIGatewayProxyResponse {

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		log.Println("User does not exist in database: " + *userId)
		user = db.GetDb().RegisterNewUser(userId)
	}

	jsonDebug, err := json.Marshal(user)
	if err == nil {
		log.Println("Got user from database: " + string(jsonDebug))
	}

	data := &models.Update{Users: []*models.User{user}}
	return lib.BuildUpdate(data)
}
