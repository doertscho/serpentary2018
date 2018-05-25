package dynamodb

import (
	"github.com/aws/aws-sdk-go/aws"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) queryItemsByKey(
	tableName string, fieldName string, value *string,
) (*sdk.QueryOutput, error) {

	hash := ":" + fieldName
	queryString := fieldName + " = " + hash
	valuesToBind := map[string]*sdk.AttributeValue{
		hash: stringAttr(value),
	}
	return db.query(tableName, queryString, valuesToBind)
}

var NO_VALUES map[string]*sdk.AttributeValue = map[string]*sdk.AttributeValue{}

func (db DynamoDb) query(
	tableName string,
	queryString string,
	valuesToBind map[string]*sdk.AttributeValue,
) (*sdk.QueryOutput, error) {

	input := &sdk.QueryInput{
		TableName:                 table(tableName),
		KeyConditionExpression:    aws.String(queryString),
		ExpressionAttributeValues: valuesToBind,
	}
	return db.Svc.Query(input)
}

func (db DynamoDb) queryIndex(
	tableName string,
	indexName string,
	query string,
	valuesToBind map[string]*sdk.AttributeValue,
) (*sdk.QueryOutput, error) {

	input := &sdk.QueryInput{
		TableName:                 table(tableName),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    aws.String(query),
		ExpressionAttributeValues: valuesToBind,
	}
	return db.Svc.Query(input)
}
