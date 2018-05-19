package lib

import (
	"main/conf"
	"main/models"

	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/protobuf/proto"
)

func Options() events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                 "text/plain",
			"Access-Control-Allow-Origin":  conf.AllowOrigin,
			"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
			"Access-Control-Allow-Headers": "Authorization",
		},
	}
}

func BadRequest(message string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 400,
		Body:       message,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func Unauthorized() events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 401,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func NotFound() events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 404,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func InternalError() events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: 500,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func BuildUpdate(data *models.Update) events.APIGatewayProxyResponse {

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
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}
