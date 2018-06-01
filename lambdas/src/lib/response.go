package lib

import (
	"encoding/base64"
	"main/conf"
	"main/models"

	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/protobuf/proto"
)

func Options() *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type":                 "text/plain",
			"Access-Control-Allow-Origin":  conf.AllowOrigin,
			"Access-Control-Allow-Methods": "GET,POST,OPTIONS",
			"Access-Control-Allow-Headers": "Authorization",
		},
	}
}

func BadRequest(message string) *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 400,
		Body:       message,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func Unauthorized() *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 401,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func Forbidden(message string) *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 403,
		Body:       message,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func NotFound() *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 404,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func Gone(message string) *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 410,
		Body:       message,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func InternalError() *events.APIGatewayProxyResponse {
	return &events.APIGatewayProxyResponse{
		StatusCode: 500,
		Headers: map[string]string{
			"Content-Type":                "text/plain",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}

func BuildUpdate(data *models.Update) *events.APIGatewayProxyResponse {

	serialised, err := proto.Marshal(data)

	if err != nil {
		log.Fatal("Failed to serialise data: " + err.Error())
		return &events.APIGatewayProxyResponse{StatusCode: 500}
	}

	encoded := base64.StdEncoding.EncodeToString(serialised)

	return &events.APIGatewayProxyResponse{

		StatusCode: 200,
		Body:       encoded,

		Headers: map[string]string{
			"Content-Type":                "application/protobuf",
			"Access-Control-Allow-Origin": conf.AllowOrigin,
		},
	}
}
