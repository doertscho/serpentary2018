package dynamodb

import (
	"log"
	"main/models"
	"strconv"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetBetsByMatchDayAndSquadId(
	tournamentId *string, matchDayId *string, squadId *string,
) *models.MatchDayBetBucket {

	record := db.getBetBucketRecord(tournamentId, matchDayId, squadId)
	if record == nil {
		return nil
	}

	betBucket := unmarshalBetBucketRecord(
		record, tournamentId, matchDayId, squadId)
	if betBucket == nil {
		return nil
	}

	return betBucket
}

func (db DynamoDb) AddBetToBetBucket(
	tournamentId *string, matchDayId *string, squadId *string,
	userId *string, bet *models.Bet,
) *models.MatchDayBetBucket {

	record := db.getBetBucketRecord(tournamentId, matchDayId, squadId)
	if record == nil {
		return nil
	}

	betsMap := getBetsMap(record)
	if betsMap == nil {
		log.Println("The record's 'bets' field is not a map attribute")
		return nil
	}

	betRecord, err := attr.MarshalMap(bet)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return nil
	}
	betValue := &sdk.AttributeValue{M: betRecord}

	userBets := (*betsMap)[*userId]
	if userBets == nil || userBets.L == nil {
		userBets = &sdk.AttributeValue{
			L: []*sdk.AttributeValue{betValue},
		}
	} else {
		replaced := false
		for idx, val := range userBets.L {
			if val.M == nil ||
				val.M["match_id"] == nil ||
				val.M["match_id"].N == nil {
				continue
			}
			if *(val.M["match_id"].N) == strconv.Itoa(int(bet.MatchId)) {
				userBets.L[idx] = betValue
				replaced = true
				break
			}
		}
		if !replaced {
			userBets.L = append(userBets.L, betValue)
		}
	}

	newBetBucketRecord, err := db.updateItem(
		"bets",
		compoundKey(
			"squad_id", squadId,
			"tournament_and_match_day_id", models.JoinKeys(tournamentId, matchDayId),
		),
		set("bets.#userId = :bets").
			withFieldName("#userId", userId).
			bind(":bets", userBets),
	)
	if err != nil {
		log.Println("Failed to update bets: " + err.Error())
		return nil
	}

	betBucket := unmarshalBetBucketRecord(
		newBetBucketRecord, tournamentId, matchDayId, squadId)
	if betBucket == nil {
		return nil
	}

	return betBucket
}

func (db DynamoDb) getBetBucketRecord(
	tournamentId *string, matchDayId *string, squadId *string,
) *map[string]*sdk.AttributeValue {

	record, err := db.getItemByCompoundKey(
		"bets",
		"squad_id", squadId,
		"tournament_and_match_day_id", models.JoinKeys(tournamentId, matchDayId),
	)
	if err != nil {
		log.Println("Error occurred querying bet record: " + err.Error())
		return nil
	}
	return record
}

func unmarshalBetBucketRecord(
	record *map[string]*sdk.AttributeValue,
	tournamentId *string, matchDayId *string, squadId *string,
) *models.MatchDayBetBucket {

	betsMap := getBetsMap(record)
	if betsMap == nil {
		log.Println("The record's 'bets' field is not a map attribute")
		return nil
	}

	userBetBuckets := make([]*models.UserBetBucket, len(*betsMap))
	i := 0
	for userId, userBets := range *betsMap {
		bets := unmarshalUserBetsArray(userBets)
		if bets == nil {
			log.Println("Failed to unmarshal bets for user " + userId)
			return nil
		}
		userBetBucket := models.UserBetBucket{
			UserId: userId,
			Bets:   *bets,
		}
		userBetBuckets[i] = &userBetBucket
		i = i + 1
	}

	betBucket := models.MatchDayBetBucket{}
	betBucket.SquadId = *squadId
	betBucket.TournamentId = *tournamentId
	betBucket.MatchDayId = *matchDayId
	betBucket.Bets = userBetBuckets

	return &betBucket
}

func getBetsMap(
	betBucketRecord *map[string]*sdk.AttributeValue,
) *map[string]*sdk.AttributeValue {

	betsAttribute := (*betBucketRecord)["bets"]
	if betsAttribute == nil {
		log.Println("Record did not contain 'bets' field")
		return nil
	}

	return &betsAttribute.M
}

func unmarshalUserBetsArray(attribute *sdk.AttributeValue) *[]*models.Bet {

	list := attribute.L
	if list == nil {
		log.Println("Received attribute was not of type list")
		return nil
	}

	bets := make([]*models.Bet, len(list))
	for idx, record := range list {
		bet := models.Bet{}
		err := attr.UnmarshalMap(record.M, &bet)
		if err != nil {
			log.Println("Failed to unmarshal bet record")
			return nil
		}
		bets[idx] = &bet
	}

	return &bets
}
