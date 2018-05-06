package lib

import (
	"main/models"

	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/protobuf/proto"
)

func NotFound() events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{StatusCode: 404}
}

func BadRequest(message string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 400,
		Body:       message,
	}
}

func BuildResponse(data *models.Update) events.APIGatewayProxyResponse {

	serialised, err := proto.Marshal(data)

	if err != nil {
		log.Fatal("Failed to serialise data")
		return events.APIGatewayProxyResponse{StatusCode: 500}
	}

	return events.APIGatewayProxyResponse{

		StatusCode: 200,
		Body:       string(serialised),

		Headers: map[string]string{
			"Content-Type":                "application/octet-stream",
			"Access-Control-Allow-Origin": "*",
		},
	}
}
