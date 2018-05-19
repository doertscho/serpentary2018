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

func (db DynamoDb) GetTournamentById(tournamentId int) *models.Tournament {

	log.Println("trying to find tournament with id " + strconv.Itoa(tournamentId))

	record, err := getItem("tournaments", tournamentId)
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
	tournamentId int) []*models.MatchDay {

	values := map[string]*dynamodb.AttributeValue{
		":id": {N: aws.String(strconv.Itoa(tournamentId))},
	}
	result, err := query("match-days", "tournament_id = :id", values)
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

func (db DynamoDb) GetMatchDayById(matchDayId int) *models.MatchDay {

	log.Println("trying to find match day with id " + strconv.Itoa(matchDayId))

	record, err := getItem("match-days", matchDayId)
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

func (db DynamoDb) GetMatchesByMatchDayId(matchDayId int) []*models.Match {

	values := map[string]*dynamodb.AttributeValue{
		":id": {N: aws.String(strconv.Itoa(matchDayId))},
	}
	result, err := query("matches", "match_day_id = :id", values)
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

func (db DynamoDb) GetUserByName(userName string) *models.User {

	values := map[string]*dynamodb.AttributeValue{
		":name": {S: aws.String(userName)},
	}
	result, err := queryIndex("users", "NameIndex", "name = :name", values)
	if err != nil {
		log.Println("error occurred querying match days: " + err.Error())
		return nil
	}

	if len(result.Items) != 1 {
		return nil
	}

	user := models.User{}
	err = dynamodbattribute.UnmarshalMap(result.Items[0], &user)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &user
}

func (db DynamoDb) RegisterNewUser(userName string) *models.User {

	input := dynamodb.PutItemInput{
		Item: map[string]*dynamodb.AttributeValue{
			"name": {S: aws.String(userName)},
		},
		TableName: aws.String(conf.TablePrefix + "users"),
	}
	_, err := dynDbSvc.PutItem(&input)
	if err != nil {
		log.Println("Failed to create user entry: " + err.Error())
		return nil
	}

	return db.GetUserByName(userName)
}

func getItem(tableName string, id int) (*dynamodb.GetItemOutput, error) {

	if dynDbSvc == nil {
		return nil, errors.New("connection has not been initialised")
	}

	input := &dynamodb.GetItemInput{
		TableName: aws.String(conf.TablePrefix + tableName),
		Key: map[string]*dynamodb.AttributeValue{
			"id": {N: aws.String(strconv.Itoa(id))},
		},
	}
	return dynDbSvc.GetItem(input)
}

var NO_VALUES map[string]*dynamodb.AttributeValue = map[string]*dynamodb.AttributeValue{}

func query(
	tableName string,
	query string,
	valuesToBind map[string]*dynamodb.AttributeValue,
) (*dynamodb.QueryOutput, error) {
	input := &dynamodb.QueryInput{
		TableName:                 aws.String(conf.TablePrefix + tableName),
		KeyConditionExpression:    aws.String(query),
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
