package dynamodb

import (
	"github.com/aws/aws-sdk-go/aws"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

type query struct {
	expression string
	values     map[string]*sdk.AttributeValue
}

func newQuery(expression string) *query {
	return &query{
		expression: expression,
		values:     map[string]*sdk.AttributeValue{},
	}
}

func (q query) bind(field string, value *sdk.AttributeValue) *query {
	q.values[field] = value
	return &q
}

func set(expression string) *query {
	extended := "SET " + expression + ", updated = :updateTimestamp"
	return newQuery(extended).bind(":updateTimestamp", timestamp())
}

func (db DynamoDb) updateItem(
	tableName string,
	key *map[string]*sdk.AttributeValue,
	query *query,
) (*map[string]*sdk.AttributeValue, error) {

	updateSquadInput := &sdk.UpdateItemInput{
		TableName:                 table(tableName),
		Key:                       *key,
		UpdateExpression:          &query.expression,
		ExpressionAttributeValues: query.values,
		ReturnValues:              aws.String("ALL_NEW"),
	}
	result, err := db.Svc.UpdateItem(updateSquadInput)
	if err != nil {
		return nil, err
	}
	return &result.Attributes, nil
}
