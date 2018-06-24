package main

import (
	"log"
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

	userId := lib.GetUserId(request)

	if userId == nil {
		log.Println("Can not access admin operations as unauthorised user")
		return *lib.Unauthorized(), nil
	}

	if !lib.IsAdminUser(userId) {
		log.Println("User is not authorised for admin access")
		return *lib.Forbidden("You are not authorised to access this"), nil
	}

	matchPath := lib.MakePathMatcher(request.Path)

	if request.HTTPMethod == "GET" {
		response := getRequest(matchPath, &request.PathParameters, userId)
		if response != nil {
			return *response, nil
		}
	}

	if request.HTTPMethod == "POST" {
		response := postRequest(
			matchPath, &request.PathParameters, userId, &request.Body)
		if response != nil {
			return *response, nil
		}
	}

	return *lib.NotFound(), nil
}

func getRequest(
	matchPath func(...string) bool,
	params *map[string]string,
	userId *string,
) *events.APIGatewayProxyResponse {

	return nil
}

func postRequest(
	matchPath func(...string) bool,
	params *map[string]string,
	userId *string,
	data *string,
) *events.APIGatewayProxyResponse {

	if matchPath("tournaments", "_", "match-days", "_", "matches", "_") {
		tournamentId := (*params)["tournamentId"]
		matchDayId := (*params)["matchDayId"]
		matchId := (*params)["matchId"]
		return handlers.UpdateMatchData(
			&tournamentId, &matchDayId, &matchId, userId, data)
	}

	return nil
}
