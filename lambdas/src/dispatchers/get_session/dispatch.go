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
		return lib.Options(), nil
	}

	userName := lib.GetUserName(request)
	if userName == nil {
		return lib.Unauthorized(), nil
	}

	path := lib.ParsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "me"); doesMatch {
		return handlers.DispatchMeRequest(rest, *userName), nil
	}

	return lib.NotFound(), nil
}
