package main

import (
	"main/handlers"
	"main/lib"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(dispatch)
}

func dispatch(request events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	lib.LogRequest(request)

	if request.HTTPMethod == "OPTIONS" {
		return lib.Options(), nil
	}

	userId := lib.GetUserId(request)
	if userId == nil {
		return lib.Unauthorized()
	}

	path := lib.ParsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "me"); doesMatch {
		return handlers.DispatchMeRequest(rest, &userId), nil
	}

	return lib.NotFound(), nil
}
