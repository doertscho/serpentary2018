package dynamodb

import (
	"log"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) putRecord(
	tableName string,
	record *map[string]*sdk.AttributeValue,
) (*sdk.PutItemOutput, error) {

	input := sdk.PutItemInput{
		Item:      *record,
		TableName: table(tableName),
	}
	return db.Svc.PutItem(&input)
}

func (db DynamoDb) putStruct(
	tableName string,
	structValue *interface{},
) (*sdk.PutItemOutput, error) {

	record, err := attr.MarshalMap(structValue)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return nil, err
	}
	return db.putRecord(tableName, &record)
}
