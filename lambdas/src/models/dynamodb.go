package models

import (
	"errors"
	"strconv"

	"github.com/aws/aws-sdk-go/service/dynamodb"
)

func (ls *LocalisableString) MarshalDynamoDBAttributeValue(
	av *dynamodb.AttributeValue) error {

	av.M = make(map[string]*dynamodb.AttributeValue, len(ls.Localisations))
	for _, val := range ls.Localisations {
		key := strconv.Itoa(int(val.Locale))
		value := &dynamodb.AttributeValue{S: &val.Value}
		av.M[key] = value
	}

	return nil
}

func (ls *LocalisableString) UnmarshalDynamoDBAttributeValue(
	av *dynamodb.AttributeValue) error {

	if av.M == nil {
		return nil
	}

	ls.Localisations = make([]*Localisation, len(av.M))
	i := 0
	for key, entry := range av.M {
		locale, err := strconv.Atoi(key)
		if err != nil {
			return err
		}
		if entry.S == nil {
			return errors.New("Invalid value")
		}
		value := entry.S
		ls.Localisations[i] = &Localisation{Locale: Locale(locale), Value: *value}
		i = i + 1
	}

	return nil
}
