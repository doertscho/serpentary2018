package dynamodb

import (
	"log"
	"main/lib"
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

func (db DynamoDb) GetPoolWithExtraBetsById(
	squadId *string, tournamentId *string,
) (*models.Pool, *[]*models.User, *models.ExtraQuestionBetBucket) {

	record := db.getPoolRecord(squadId, tournamentId)
	if record == nil {
		return nil, nil, nil
	}

	pool := models.Pool{}
	err := attr.UnmarshalMap(*record, &pool)
	if err != nil {
		log.Println("Error unmarshalling pool record: " + err.Error())
		return nil, nil, nil
	}

	users := buildUsersFromPreferredNames(record)
	if users == nil {
		users = &[]*models.User{}
	}

	extraBets := unmarshalExtraQuestionBetBucketRecord(
		record, squadId, tournamentId, pool.Updated)

	return &pool, users, extraBets
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
			bind(":poolId", stringListAttr(joinKeys(squadId, tournamentId))),
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

func (db DynamoDb) AddBetsToExtraQuestionBetBucket(
	squadId *string, tournamentId *string,
	userId *string, bets *models.ExtraQuestionUserBetBucket,
) *models.ExtraQuestionBetBucket {

	record := db.getPoolRecord(squadId, tournamentId)
	if record == nil {
		return nil
	}

	betsMap := getExtraQuestionsBetsMap(record)
	if betsMap == nil {
		return nil
	}

	betRecord, err := attr.MarshalMap(bets)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return nil
	}
	betsList := betRecord["bets"]

	userBets := (*betsMap)[*userId]
	if userBets == nil || userBets.L == nil {
		userBets = betsList
	} else {
		for _, newBetVal := range betsList.L {
			replaced := false
			for idx, val := range userBets.L {
				if val.M == nil ||
					val.M["question_id"] == nil ||
					val.M["question_id"].N == nil {
					continue
				}
				if *(val.M["question_id"].N) == *newBetVal.M["question_id"].N {
					userBets.L[idx] = newBetVal
					replaced = true
					break
				}
			}
			if !replaced {
				userBets.L = append(userBets.L, newBetVal)
			}
		}
	}

	newPoolRecord, err := db.updateItem(
		"pools",
		compoundKey(
			"squad_id", squadId,
			"tournament_id", tournamentId,
		),
		set("extra_question_bets.#userId = :bets").
			withFieldName("#userId", userId).
			bind(":bets", userBets),
	)
	if err != nil {
		log.Println("Failed to update special question bets: " + err.Error())
		return nil
	}

	betBucket := unmarshalExtraQuestionBetBucketRecord(
		newPoolRecord, squadId, tournamentId, lib.Timestamp())
	if betBucket == nil {
		return nil
	}

	return betBucket
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

func getExtraQuestionsBetsMap(
	poolRecord *map[string]*sdk.AttributeValue,
) *map[string]*sdk.AttributeValue {

	betsAttribute := (*poolRecord)["extra_question_bets"]
	if betsAttribute == nil {
		log.Println("Record did not contain 'extra_question_bets' field")
		return nil
	}

	betsMap := &betsAttribute.M
	if betsMap == nil {
		log.Println("The record's 'extra_question_bets' field is not a map")
	}
	return betsMap
}

func unmarshalExtraQuestionBetBucketRecord(
	poolRecord *map[string]*sdk.AttributeValue,
	squadId *string, tournamentId *string,
	updated uint32,
) *models.ExtraQuestionBetBucket {

	betsMap := getExtraQuestionsBetsMap(poolRecord)
	if betsMap == nil {
		return nil
	}

	userBetBuckets := make([]*models.ExtraQuestionUserBetBucket, len(*betsMap))
	i := 0
	for userId, betsValue := range *betsMap {
		userBets := []*models.ExtraQuestionBet{}
		if betsValue.L != nil {
			userBets = make([]*models.ExtraQuestionBet, len(betsValue.L))
			for i, betData := range betsValue.L {
				bet := &models.ExtraQuestionBet{}
				err := attr.UnmarshalMap(betData.M, bet)
				if err != nil {
					log.Println("Error unmarshalling bet record: " + err.Error())
					return nil
				}
				userBets[i] = bet
			}
		}
		userBetBucket := models.ExtraQuestionUserBetBucket{
			UserId: userId,
			Bets:   userBets,
		}
		userBetBuckets[i] = &userBetBucket
	}

	betBucket := models.ExtraQuestionBetBucket{
		Updated:      updated,
		SquadId:      *squadId,
		TournamentId: *tournamentId,
		Bets:         userBetBuckets,
	}

	return &betBucket
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
