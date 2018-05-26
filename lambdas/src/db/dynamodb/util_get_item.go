package dynamodb

import (
	"errors"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) getItemById(
	tableName string,
	id *string,
) (*map[string]*sdk.AttributeValue, error) {

	key := map[string]*sdk.AttributeValue{
		"id": stringAttr(id),
	}
	return db.getItem(tableName, key)
}

func (db DynamoDb) getItemByCompoundKey(
	tableName string,
	partitionKeyName string,
	partitionKeyValue *string,
	sortKeyName string,
	sortKeyValue *string,
) (*map[string]*sdk.AttributeValue, error) {

	key := map[string]*sdk.AttributeValue{
		partitionKeyName: stringAttr(partitionKeyValue),
		sortKeyName:      stringAttr(sortKeyValue),
	}
	return db.getItem(tableName, key)
}

func (db DynamoDb) getItem(
	tableName string,
	key map[string]*sdk.AttributeValue,
) (*map[string]*sdk.AttributeValue, error) {

	if db.Svc == nil {
		return nil, errors.New("connection has not been initialised")
	}

	input := &sdk.GetItemInput{
		TableName: table(tableName),
		Key:       key,
	}
	result, err := db.Svc.GetItem(input)
	if err != nil {
		return nil, err
	}
	return &result.Item, nil
}
