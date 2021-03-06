package dynamodb

import (
	"github.com/aws/aws-sdk-go/aws"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

type query struct {
	expression string
	names      map[string]*string
	values     map[string]*sdk.AttributeValue
}

func newQuery(expression string) *query {
	return &query{
		expression: expression,
		names:      map[string]*string{},
		values:     map[string]*sdk.AttributeValue{},
	}
}

func (q query) withFieldName(fieldName string, value *string) *query {
	q.names[fieldName] = value
	return &q
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
	if len(query.names) > 0 {
		updateSquadInput.ExpressionAttributeNames = query.names
	}
	s := newStopWatch("UpdateItem on " + tableName)
	result, err := db.Svc.UpdateItem(updateSquadInput)
	s.stopAndLog()
	if err != nil {
		return nil, err
	}
	return &result.Attributes, nil
}
