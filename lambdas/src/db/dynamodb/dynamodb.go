package dynamodb

import (
	"log"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

type DynamoDb struct {
	Svc *sdk.DynamoDB
}

func GetDynamoDb() DynamoDb {

	awsSession, err := session.NewSession(
		&aws.Config{
			Region: aws.String("eu-central-1"),
		},
	)
	if err != nil {
		log.Println("Failed to create session: " + err.Error())
	}

	dynDbSvc := sdk.New(awsSession)

	return DynamoDb{dynDbSvc}
}
