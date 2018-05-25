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

func dispatch(
	request events.APIGatewayProxyRequest,
) (events.APIGatewayProxyResponse, error) {

	lib.LogRequest(request)

	if request.HTTPMethod == "OPTIONS" {
		return *lib.Options(), nil
	}

	matchPath := lib.MakePathMatcher(request.Path)

	if request.HTTPMethod == "GET" {
		response := getRequest(matchPath, request.PathParameters)
		if response != nil {
			return *response, nil
		}
	}

	if request.HTTPMethod == "POST" {
		userId := lib.GetUserId(request)
		if userId == nil {
			return *lib.Unauthorized(), nil
		}
		response := postRequest(matchPath, request.PathParameters, userId)
		if response != nil {
			return *response, nil
		}
	}

	return *lib.NotFound(), nil
}

func getRequest(
	matchPath func(...string) bool,
	params map[string]string,
) *events.APIGatewayProxyResponse {

	if matchPath("tournaments") {
		return handlers.GetTournaments()
	}

	if matchPath("tournaments", "_") {
		tournamentId := params["tournamentId"]
		return handlers.GetTournamentById(&tournamentId)
	}

	if matchPath("tournaments", "_", "pools", "_") {
		tournamentId := params["tournamentId"]
		squadId := params["squadId"]
		return handlers.GetPoolById(&squadId, &tournamentId)
	}

	if matchPath("squads", "_") {
		squadId := params["squadId"]
		return handlers.GetSquadById(&squadId)
	}

	return nil
}

func postRequest(
	matchPath func(...string) bool,
	params map[string]string,
	userId *string,
) *events.APIGatewayProxyResponse {

	if matchPath("squads", "_") {
		squadId := params["squadId"]
		return handlers.AddUserToSquad(&squadId, userId)
	}

	return nil
}
