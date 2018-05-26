package dynamodb

import (
	"errors"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) getItemBatchByIds(
	tableName string,
	ids *[]string,
) (*[]map[string]*sdk.AttributeValue, error) {

	keys := make([]map[string]*sdk.AttributeValue, len(*ids))
	for idx, id := range *ids {
		keys[idx] = map[string]*sdk.AttributeValue{
			"id": stringAttr(&id),
		}
	}
	return db.getItemBatch(tableName, keys)
}

func (db DynamoDb) getItemBatch(
	tableName string,
	keys []map[string]*sdk.AttributeValue,
) (*[]map[string]*sdk.AttributeValue, error) {

	if db.Svc == nil {
		return nil, errors.New("connection has not been initialised")
	}

	prefixedTableName := *table(tableName)

	input := &sdk.BatchGetItemInput{
		RequestItems: map[string]*sdk.KeysAndAttributes{
			prefixedTableName: {
				Keys: keys,
			},
		},
	}
	result, err := db.Svc.BatchGetItem(input)
	if err != nil {
		return nil, err
	}

	records := result.Responses[prefixedTableName]
	return &records, nil
}
