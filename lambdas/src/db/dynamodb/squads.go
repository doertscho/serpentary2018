package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetSquads() []*models.Squad {

	result, err := db.scanTable("squads")
	if err != nil {
		log.Println("error occurred querying squads: " + err.Error())
		return nil
	}

	squads := make([]*models.Squad, len(result.Items))
	for idx, val := range result.Items {
		squad := models.Squad{}
		err = attr.UnmarshalMap(val, &squad)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		squads[idx] = &squad
	}

	return squads
}

func (db DynamoDb) GetSquadById(
	squadId *string,
) (*models.Squad, *[]*models.User) {

	record, err := db.getItemById("squads", squadId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil, nil
	}

	squad := models.Squad{}
	err = attr.UnmarshalMap(*record, &squad)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil, nil
	}

	users := buildUsersFromPreferredNames(record)
	if users == nil {
		users = &[]*models.User{}
	}

	return &squad, users
}

func (db DynamoDb) AddUserToSquad(
	squadId *string,
	userId *string,
) (*models.Squad, *models.User) {

	squadRecord, err := db.updateItem(
		"squads",
		stringId(squadId),
		set("members = list_append(members, :userId)").
			bind(":userId", stringListAttr(userId)),
	)
	if err != nil {
		log.Println("Failed to update squad: " + err.Error())
		return nil, nil
	}
	squad := models.Squad{}
	err = attr.UnmarshalMap(*squadRecord, &squad)
	if err != nil {
		log.Println("Error unmarshalling item: " + err.Error())
		return nil, nil
	}

	userRecord, err := db.updateItem(
		"users",
		stringId(userId),
		set("squads = list_append(squads, :squadId)").
			bind(":squadId", stringListAttr(squadId)),
	)
	if err != nil {
		log.Println("Failed to update squad: " + err.Error())
		return nil, nil
	}
	user := models.User{}
	err = attr.UnmarshalMap(*userRecord, &user)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil, nil
	}

	return &squad, &user
}

func (db DynamoDb) UpdatePreferredNameForUserOnSquad(
	squadId *string,
	userId *string, preferredName *string,
) *models.Squad {

	squadRecord, err := db.updateItem(
		"squads",
		stringId(squadId),
		set("preferred_names.#userId = :newName").
			withFieldName("#userId", userId).
			bind(":newName", stringAttr(preferredName)),
	)
	if err != nil {
		log.Println("Failed to update squad: " + err.Error())
		return nil
	}
	squad := models.Squad{}
	err = attr.UnmarshalMap(*squadRecord, &squad)
	if err != nil {
		log.Println("Error unmarshalling squad record: " + err.Error())
		return nil
	}

	return &squad
}
