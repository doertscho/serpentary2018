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
	s := newStopWatch("GetItem on " + tableName)
	result, err := db.Svc.GetItem(input)
	s.stopAndLog()
	if err != nil {
		return nil, err
	}
	if result == nil || result.Item == nil || len(result.Item) == 0 {
		return nil, errors.New("Item was not found")
	}

	return &result.Item, nil
}
