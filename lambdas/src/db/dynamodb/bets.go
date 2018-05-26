package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetBetsByMatchDayAndSquadId(
	tournamentId *string, matchDayId *string, squadId *string,
) *models.MatchDayBetBucket {

	record, err := db.getItemByCompoundKey(
		"bets",
		"squad_id", squadId,
		"tournament_and_match_day_id", joinKeys(tournamentId, matchDayId),
	)
	if err != nil {
		log.Println("Error occurred querying bet record: " + err.Error())
		return nil
	}

	betBucket := models.MatchDayBetBucket{}
	err = attr.UnmarshalMap(*record, &betBucket)
	if err != nil {
		log.Println("Error unmarshalling bet record: " + err.Error())
		return nil
	}
	betBucket.TournamentId = *tournamentId
	betBucket.MatchDayId = *matchDayId

	return &betBucket
}
