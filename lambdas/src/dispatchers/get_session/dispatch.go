package main

import (
	"main/db"
	"main/handlers"
	"main/lib"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func init() {
	db.InitDatabase()
}

func main() {
	lambda.Start(dispatch)
}

func dispatch(request events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	lib.LogRequest(request)

	if request.HTTPMethod == "OPTIONS" {
		return *lib.Options(), nil
	}

	userId := lib.GetUserId(request)
	if userId == nil {
		return *lib.Unauthorized(), nil
	}

	matchPath := lib.MakePathMatcher(request.Path)

	if request.HTTPMethod == "GET" {
		if matchPath("me") {
			return *handlers.GetMe(userId), nil
		}
	}

	if request.HTTPMethod == "POST" {
		if matchPath("me", "preferred-name") {
			return *handlers.UpdatePreferredName(userId, &request.Body), nil
		}
	}

	return *lib.NotFound(), nil
}
