package dynamodb

import (
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) scanTable(tableName string) (*sdk.ScanOutput, error) {
	return db.Svc.Scan(&sdk.ScanInput{TableName: table(tableName)})
}
