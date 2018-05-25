package dynamodb

import (
	"log"
	"main/lib"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetUserById(userId *string) *models.User {

	log.Println("Getting user data for " + *userId)
	record, err := db.getItemById("users", userId)
	if err != nil {
		log.Println("Error occurred querying item: " + err.Error())
		return nil
	}

	user := models.User{}
	err = attr.UnmarshalMap(record.Item, &user)
	if err != nil {
		log.Println("Error unmarshalling item: " + err.Error())
		return nil
	}

	return &user
}

func (db DynamoDb) RegisterNewUser(userId *string) *models.User {

	if userId == nil {
		return nil
	}

	user := models.User{
		Id:      *userId,
		Updated: lib.Timestamp(),
	}

	record, err := attr.MarshalMap(user)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return nil
	}
	initialiseEmptyList(&record, "squads", "pools")

	_, err = db.putRecord("users", &record)
	if err != nil {
		log.Println("Failed to create user entry: " + err.Error())
		return nil
	}

	return &user
}
