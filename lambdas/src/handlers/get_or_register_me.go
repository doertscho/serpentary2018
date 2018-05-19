package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func DispatchMeRequest(
	path []string, userId *string) events.APIGatewayProxyResponse {

	if len(path) != 0 {
		return lib.NotFound()
	}

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		user = db.GetDb().RegisterNewUser(userId)
	}

	data := &models.Update{Users: []*models.User{user}}
	return lib.BuildUpdate(data)
}
