package dynamodb

import (
	"log"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) putRecord(
	tableName string,
	record *map[string]*sdk.AttributeValue,
) (*map[string]*sdk.AttributeValue, error) {

	input := sdk.PutItemInput{
		Item:      *record,
		TableName: table(tableName),
	}
	s := newStopWatch("PutItem on " + tableName)
	result, err := db.Svc.PutItem(&input)
	s.stopAndLog()
	if err != nil {
		return nil, err
	}
	return &result.Attributes, nil
}

func (db DynamoDb) putStruct(
	tableName string,
	structValue *interface{},
) (*map[string]*sdk.AttributeValue, error) {

	record, err := attr.MarshalMap(structValue)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return nil, err
	}
	return db.putRecord(tableName, &record)
}
