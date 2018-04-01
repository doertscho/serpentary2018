package main

import (
	"main/models"

	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/golang/protobuf/proto"
)

func handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	someMatch := &models.Match{Id: 1, HomeTeamId: 35, AwayTeamId: 48}
	someData, err := proto.Marshal(someMatch)
	if err != nil {
		log.Fatal("Failed to serialise data")
		return events.APIGatewayProxyResponse{StatusCode: 500}, nil
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Body:       string(someData),
		Headers: map[string]string{
			"Content-Type": "application/octet-stream",
		},
	}, nil

}

func main() {
	lambda.Start(handler)
}
