package handlers

import (
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func DispatchMeRequest(
	path []string, userId int32) events.APIGatewayProxyResponse {

	if len(path) != 0 {
		return lib.NotFound()
	}

	data := &models.Session{UserId: userId}
	return lib.BuildSession(data)
}
