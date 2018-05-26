package dynamodb

import (
	"github.com/aws/aws-sdk-go/aws"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) queryItemsByKey(
	tableName string, fieldName string, value *string,
) (*[]map[string]*sdk.AttributeValue, error) {

	hash := ":" + fieldName
	queryString := fieldName + " = " + hash
	valuesToBind := map[string]*sdk.AttributeValue{
		hash: stringAttr(value),
	}
	return db.query(tableName, queryString, valuesToBind)
}

func (db DynamoDb) query(
	tableName string,
	queryString string,
	valuesToBind map[string]*sdk.AttributeValue,
) (*[]map[string]*sdk.AttributeValue, error) {

	input := &sdk.QueryInput{
		TableName:                 table(tableName),
		KeyConditionExpression:    aws.String(queryString),
		ExpressionAttributeValues: valuesToBind,
	}
	result, err := db.Svc.Query(input)
	if err != nil {
		return nil, err
	}
	return &result.Items, nil
}

func (db DynamoDb) queryIndex(
	tableName string,
	indexName string,
	query string,
	valuesToBind map[string]*sdk.AttributeValue,
) (*[]map[string]*sdk.AttributeValue, error) {

	input := &sdk.QueryInput{
		TableName:                 table(tableName),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    aws.String(query),
		ExpressionAttributeValues: valuesToBind,
	}
	result, err := db.Svc.Query(input)
	if err != nil {
		return nil, err
	}
	return &result.Items, nil
}
