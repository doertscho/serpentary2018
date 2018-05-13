package main

import (
	"encoding/json"
	"log"
	"main/conf"
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
		log.Println("failed to serialise request data: " + err.Error())
		return lib.InternalError(), nil
	}
	log.Println("received request: " + string(requestDebug))

	if request.HTTPMethod == "OPTIONS" {
		return lib.Options(), nil
	}

	path := lib.ParsePath(request.Path)

	if doesMatch, rest := lib.MatchPrefix(path, "my"); doesMatch {

		if doesMatch, rest := lib.MatchPrefix(rest, "id"); doesMatch {

			if len(rest) == 0 {

				authorizerDebug, err := json.Marshal(request.RequestContext.Authorizer)

				if err != nil {
					return lib.InternalError(), nil
				}

				return events.APIGatewayProxyResponse{

					StatusCode: 200,
					Body:       string(authorizerDebug),

					Headers: map[string]string{
						"Content-Type":                "application/json",
						"Access-Control-Allow-Origin": conf.AllowOrigin,
					},
				}, nil

			}
		}
	}

	return lib.NotFound(), nil
}
