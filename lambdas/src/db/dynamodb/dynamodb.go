package dynamodb

import (
	"main/lib"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

type DynamoDb struct {
	Svc *sdk.DynamoDB
}

func GetDynamoDb() DynamoDb {
	awsSession := lib.GetAwsSession()
	dynDbSvc := sdk.New(awsSession)
	return DynamoDb{dynDbSvc}
}
