package main

import (
	"main/handlers"
	"main/lib"
	"strings"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func main() {
	lambda.Start(dispatch)
}

func dispatch(request events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	path := parsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "tournaments"); doesMatch {
		return handlers.DispatchTournamentRequest(rest), nil
	}
	if doesMatch, rest := lib.MatchPrefix(path, "match-days"); doesMatch {
		return handlers.DispatchMatchDayRequest(rest), nil
	}

	return lib.NotFound(), nil
}

func parsePath(path string) []string {
	return lib.TrimAndFilterEmpty(strings.Split(path, "/"))
}
