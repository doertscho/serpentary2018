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

	matchPath := lib.MakePathMatcher(request.Path)

	if matchPath("tournaments") {
		return *handlers.GetTournaments(), nil
	}

	if matchPath("tournaments", "_") {
		tournamentId := request.PathParameters["tournamentId"]
		return *handlers.GetTournamentById(&tournamentId), nil
	}

	return *lib.NotFound(), nil
}
