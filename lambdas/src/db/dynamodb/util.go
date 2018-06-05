package dynamodb

import (
	"errors"
	"log"
	"main/conf"
	"main/lib"
	"strconv"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func table(name string) *string {
	return aws.String(conf.TablePrefix + name)
}

func stringAttr(value *string) *sdk.AttributeValue {
	return &sdk.AttributeValue{S: aws.String(*value)}
}

func stringId(value *string) *map[string]*sdk.AttributeValue {
	return &map[string]*sdk.AttributeValue{
		"id": stringAttr(value),
	}
}

func compoundKey(
	partitionKeyName string,
	partitionKeyValue *string,
	sortKeyName string,
	sortKeyValue *string,
) *map[string]*sdk.AttributeValue {
	return &map[string]*sdk.AttributeValue{
		partitionKeyName: stringAttr(partitionKeyValue),
		sortKeyName:      stringAttr(sortKeyValue),
	}
}

func stringListAttr(value *string) *sdk.AttributeValue {
	return &sdk.AttributeValue{
		L: []*sdk.AttributeValue{stringAttr(value)},
	}
}

func splitKey(joinedKey *sdk.AttributeValue) (*string, *string, error) {
	val := joinedKey.S
	if val == nil {
		return nil, nil, errors.New("Did not receive a string value")
	}
	parts := strings.Split(*val, "/")
	if len(parts) != 2 {
		return nil, nil, errors.New("Invalid compound key")
	}
	keyA := parts[0]
	keyB := parts[1]
	return &keyA, &keyB, nil
}

func initialiseEmptyList(
	record *map[string]*sdk.AttributeValue, fields ...string) {

	for _, field := range fields {
		(*record)[field] = &sdk.AttributeValue{L: []*sdk.AttributeValue{}}
	}
}

func timestamp() *sdk.AttributeValue {
	return &sdk.AttributeValue{
		N: aws.String(strconv.Itoa(int(lib.Timestamp()))),
	}
}

type stopWatch struct {
	start     time.Time
	operation string
}

func newStopWatch(operation string) *stopWatch {
	return &stopWatch{start: time.Now(), operation: operation}
}

func (s stopWatch) stopAndLog() {
	duration := time.Since(s.start)
	log.Println(s.operation + ": operation took " + duration.String())
}
