package db

import (
	"encoding/json"
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

	tournamentsDebug, err := json.Marshal(tournaments)
	if err == nil {
		log.Println("found tournaments: " + string(tournamentsDebug))
	}

	return tournaments
}

func (db DynamoDb) FindTournamentById(id int) *models.Tournament {

	log.Println("trying to find tournament with id " + strconv.Itoa(id))

	record, err := getItem("tournaments", id)
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

	tournamentDebug, err := json.Marshal(tournament)
	if err == nil {
		log.Println("found tournament: " + string(tournamentDebug))
	}
	return &tournament
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
