package dynamodb

import (
	"main/conf"
	"main/lib"
	"strconv"

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

func stringListAttr(value *string) *sdk.AttributeValue {
	return &sdk.AttributeValue{
		L: []*sdk.AttributeValue{stringAttr(value)},
	}
}

func joinKeys(keyA *string, keyB *string) *string {
	joined := *keyA + "/" + *keyB
	return &joined
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
