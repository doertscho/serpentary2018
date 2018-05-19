package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func DispatchMeRequest(
	path []string, userName string) events.APIGatewayProxyResponse {

	if len(path) != 0 {
		return lib.NotFound()
	}

	user := db.GetDb().GetUserByName(userName)
	if user == nil {
		user = db.GetDb().RegisterNewUser(userName)
	}

	data := &models.Update{Users: []*models.User{user}}
	return lib.BuildUpdate(data)
}
