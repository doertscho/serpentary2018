package dynamodb

import (
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) scanTable(tableName string) (*sdk.ScanOutput, error) {
	s := newStopWatch("ScanTable on " + tableName)
	result, err := db.Svc.Scan(&sdk.ScanInput{TableName: table(tableName)})
	s.stopAndLog()
	return result, err
}
