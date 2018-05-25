package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetPoolById(
	squadId *string, tournamentId *string) *models.Pool {

	record, err := db.getItemByCompoundKey(
		"pools", "squad_id", squadId, "tournament_id", tournamentId)
	if err != nil {
		log.Println("Error fetching pool record: " + err.Error())
		return nil
	}

	pool := models.Pool{}
	err = attr.UnmarshalMap(record.Item, &pool)
	if err != nil {
		log.Println("Error unmarshalling pool record: " + err.Error())
		return nil
	}

	return &pool
}

func (db DynamoDb) GetPoolsBySquadId(
	squadId *string) []*models.Pool {

	result, err := db.queryItemsByKey("pools", "squad_id", squadId)
	if err != nil {
		log.Println("Error occurred querying pools: " + err.Error())
		return nil
	}

	pools := make([]*models.Pool, len(result.Items))
	for idx, val := range result.Items {
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
	err = attr.UnmarshalMap(poolRecord.Attributes, &pool)
	if err != nil {
		log.Println("Error unmarshalling pool record: " + err.Error())
		return nil, nil
	}

	userRecord, err := db.updateItem(
		"users",
		stringId(userId),
		set("pools = list_append(pools, :poolId)").
			bind(":poolId", stringListAttr(joinKeys(squadId, tournamentId))),
	)
	if err != nil {
		log.Println("Failed to update squad: " + err.Error())
		return nil, nil
	}
	user := models.User{}
	err = attr.UnmarshalMap(userRecord.Attributes, &user)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil, nil
	}

	return &pool, &user
}
