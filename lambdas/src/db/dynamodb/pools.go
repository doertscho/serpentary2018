package dynamodb

import (
	"log"
	"main/models"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetPoolById(
	squadId *string, tournamentId *string,
) (*models.Pool, *[]*models.User) {

	record := db.getPoolRecord(squadId, tournamentId)
	if record == nil {
		return nil, nil
	}

	pool := models.Pool{}
	err := attr.UnmarshalMap(*record, &pool)
	if err != nil {
		log.Println("Error unmarshalling pool record: " + err.Error())
		return nil, nil
	}

	users := buildUsersFromPreferredNames(record)
	if users == nil {
		users = &[]*models.User{}
	}

	return &pool, users
}

func (db DynamoDb) GetPoolsBySquadId(
	squadId *string) []*models.Pool {

	result, err := db.queryItemsByKey("pools", "squad_id", squadId)
	if err != nil {
		log.Println("Error occurred querying pools: " + err.Error())
		return nil
	}

	pools := make([]*models.Pool, len(*result))
	for idx, val := range *result {
		pool := models.Pool{}
		err = attr.UnmarshalMap(val, &pool)
		if err != nil {
			log.Println("Error unmarshalling pool record: " + err.Error())
			return nil
		}
		pools[idx] = &pool
	}

	return pools
}

func (db DynamoDb) AddUserToPool(
	squadId *string,
	tournamentId *string,
	userId *string,
) (*models.Pool, *models.User) {

	poolRecord, err := db.updateItem(
		"pools",
		compoundKey("squad_id", squadId, "tournament_id", tournamentId),
		set("participants = list_append(participants, :userId)").
			bind(":userId", stringListAttr(userId)),
	)
	if err != nil {
		log.Println("Failed to update pool: " + err.Error())
		return nil, nil
	}
	pool := models.Pool{}
	err = attr.UnmarshalMap(*poolRecord, &pool)
	if err != nil {
		log.Println("Error unmarshalling pool record: " + err.Error())
		return nil, nil
	}

	userRecord, err := db.updateItem(
		"users",
		stringId(userId),
		set("pools = list_append(pools, :poolId)").
			bind(":poolId", stringListAttr(models.JoinKeys(squadId, tournamentId))),
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

	return &pool, &user
}

func (db DynamoDb) getPoolRecord(
	squadId *string, tournamentId *string,
) *map[string]*sdk.AttributeValue {

	record, err := db.getItemByCompoundKey(
		"pools", "squad_id", squadId, "tournament_id", tournamentId)
	if err != nil {
		log.Println("Error fetching pool record: " + err.Error())
		return nil
	}
	return record
}

func buildUsersFromPreferredNames(
	record *map[string]*sdk.AttributeValue) *[]*models.User {

	if record == nil {
		return nil
	}
	preferredNamesAttribute := (*record)["participants_preferred_names"]
	if preferredNamesAttribute == nil {
		return nil
	}
	idToNameMap := preferredNamesAttribute.M
	if idToNameMap == nil {
		log.Println("Field 'participants_preferred_names' exists but is not a map")
		return nil
	}
	users := make([]*models.User, len(idToNameMap))
	i := 0
	for id, value := range idToNameMap {
		preferred := value.S
		if preferred == nil {
			preferred = &id
		}
		user := models.User{Id: id, PreferredName: *preferred}
		users[i] = &user
		i = i + 1
	}
	return &users
}
