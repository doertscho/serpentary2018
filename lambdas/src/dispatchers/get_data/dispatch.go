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

	path := lib.ParsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "tournaments"); doesMatch {
		return handlers.DispatchTournamentRequest(rest), nil
	}
	if doesMatch, rest := lib.MatchPrefix(path, "match-days"); doesMatch {
		return handlers.DispatchMatchDayRequest(rest), nil
	}

	return lib.NotFound(), nil
}
