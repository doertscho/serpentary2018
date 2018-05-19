package db

import (
	"errors"
	"log"
	"main/conf"
	"main/models"
	"strconv"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

var sess session.Session
var dynDbSvc *dynamodb.DynamoDB

type DynamoDb struct{}

func InitDynamoDB() {

	sess, err := session.NewSession(
		&aws.Config{
			Region: aws.String("eu-central-1"),
		},
	)
	if err != nil {
		log.Println("Failed to create session: " + err.Error())
	}

	// Create DynamoDB client
	dynDbSvc = dynamodb.New(sess)
}

func GetDynamoDb() Db {
	return DynamoDb{}
}

func (db DynamoDb) GetTournaments() []*models.Tournament {

	log.Println("trying to fetch all tournaments")

	result, err := query("tournaments", "true", NO_VALUES)
	if err != nil {
		log.Println("error occurred querying tournaments: " + err.Error())
		return nil
	}

	tournaments := make([]*models.Tournament, len(result.Items))
	for idx, val := range result.Items {
		tournament := models.Tournament{}
		err = dynamodbattribute.UnmarshalMap(val, &tournament)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		tournaments[idx] = &tournament
	}

	return tournaments
}

func (db DynamoDb) GetTournamentById(tournamentId *int) *models.Tournament {

	log.Println("trying to find tournament with id " +
		strconv.Itoa(*tournamentId))

	record, err := getItemByNumericId("tournaments", tournamentId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	tournament := models.Tournament{}

	err = dynamodbattribute.UnmarshalMap(record.Item, &tournament)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &tournament
}

func (db DynamoDb) GetMatchDaysByTournamentId(
	tournamentId *int) []*models.MatchDay {

	result, err :=
		queryItemsByNumericRangeKey("match-days", "tournament_id", tournamentId)
	if err != nil {
		log.Println("error occurred querying match days: " + err.Error())
		return nil
	}

	matchDays := make([]*models.MatchDay, len(result.Items))
	for idx, val := range result.Items {
		matchDay := models.MatchDay{}
		err = dynamodbattribute.UnmarshalMap(val, &matchDay)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		matchDays[idx] = &matchDay
	}

	return matchDays
}

func (db DynamoDb) GetMatchDayById(matchDayId *int) *models.MatchDay {

	log.Println("trying to find match day with id " + strconv.Itoa(*matchDayId))

	record, err := getItemByNumericId("match-days", matchDayId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	matchDay := models.MatchDay{}

	err = dynamodbattribute.UnmarshalMap(record.Item, &matchDay)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &matchDay
}

func (db DynamoDb) GetMatchesByMatchDayId(matchDayId *int) []*models.Match {

	result, err :=
		queryItemsByNumericRangeKey("matches", "match_day_id", matchDayId)
	if err != nil {
		log.Println("error occurred querying match days: " + err.Error())
		return nil
	}

	matches := make([]*models.Match, len(result.Items))
	for idx, val := range result.Items {
		match := models.Match{}
		err = dynamodbattribute.UnmarshalMap(val, &match)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		matches[idx] = &match
	}

	return matches
}

func (db DynamoDb) GetUserById(userId *string) *models.User {

	record, err := getItemByStringId("users", userId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	user := models.User{}
	err = dynamodbattribute.UnmarshalMap(record.Item, &user)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &user
}

func (db DynamoDb) RegisterNewUser(userId *string) *models.User {

	if userId == nil {
		return nil
	}

	input := dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"id": {S: aws.String(*userId)},
		},
		TableName: aws.String(conf.TablePrefix + "users"),
	}
	_, err := dynDbSvc.PutItem(&input)
	if err != nil {
		log.Println("Failed to create user entry: " + err.Error())
		return nil
	}

	return db.GetUserById(userId)
}

func getItemByNumericId(tableName string, id *int) (
	*dynamodb.GetItemOutput, error) {

	if id == nil {
		return nil, errors.New("received nil id")
	}

	return getItem(
		tableName,
		&dynamodb.AttributeValue{N: aws.String(strconv.Itoa(*id))})
}

func getItemByStringId(tableName string, id *string) (
	*dynamodb.GetItemOutput, error) {

	if id == nil {
		return nil, errors.New("received nil id")
	}

	return getItem(
		tableName,
		&dynamodb.AttributeValue{S: aws.String(*id)})
}

func getItem(tableName string, id *dynamodb.AttributeValue) (
	*dynamodb.GetItemOutput, error) {

	if dynDbSvc == nil {
		return nil, errors.New("connection has not been initialised")
	}

	input := &dynamodb.GetItemInput{
		TableName: aws.String(conf.TablePrefix + tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"id": id,
		},
	}
	return dynDbSvc.GetItem(input)
}

func queryItemsByNumericRangeKey(
	tableName string, fieldName string, value *int) (
	*dynamodb.QueryOutput, error) {

	wrappedValue := dynamodb.AttributeValue{
		N: aws.String(strconv.Itoa(*value)),
	}
	return queryItemsByRangeKey(tableName, fieldName, &wrappedValue)
}

func queryItemsByRangeKey(
	tableName string, fieldName string, value *dynamodb.AttributeValue) (
	*dynamodb.QueryOutput, error) {

	hash := ":" + fieldName
	queryString := fieldName + " = " + hash
	valuesToBind := map[string]*dynamodb.AttributeValue{hash: value}
	return query(tableName, queryString, valuesToBind)
}

var NO_VALUES map[string]*dynamodb.AttributeValue = map[string]*dynamodb.AttributeValue{}

func query(
	tableName string,
	queryString string,
	valuesToBind map[string]*dynamodb.AttributeValue,
) (*dynamodb.QueryOutput, error) {
	input := &dynamodb.QueryInput{
		TableName:                 aws.String(conf.TablePrefix + tableName),
		KeyConditionExpression:    aws.String(queryString),
		ExpressionAttributeValues: valuesToBind,
	}
	return dynDbSvc.Query(input)
}

func queryIndex(
	tableName string,
	indexName string,
	query string,
	valuesToBind map[string]*dynamodb.AttributeValue,
) (*dynamodb.QueryOutput, error) {
	input := &dynamodb.QueryInput{
		TableName:                 aws.String(conf.TablePrefix + tableName),
		IndexName:                 aws.String(indexName),
		KeyConditionExpression:    aws.String(query),
		ExpressionAttributeValues: valuesToBind,
	}
	return dynDbSvc.Query(input)
}
