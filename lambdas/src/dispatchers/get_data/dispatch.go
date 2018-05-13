package main

import (
	"encoding/json"
	"log"
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

	requestDebug, err := json.Marshal(request)
	if err != nil {
		log.Println("received request: " + string(requestDebug))
	}

	if request.HTTPMethod == "OPTIONS" {
		log.Println("returning options response")
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
