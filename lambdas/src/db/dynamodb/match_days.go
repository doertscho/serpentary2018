package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetMatchDaysByTournamentId(
	tournamentId *string) []*models.MatchDay {

	result, err := db.queryItemsByKey("match-days", "tournament_id", tournamentId)
	if err != nil {
		log.Println("Error occurred querying match days: " + err.Error())
		return nil
	}

	matchDays := make([]*models.MatchDay, len(*result))
	for idx, val := range *result {
		matchDay := models.MatchDay{}
		err = attr.UnmarshalMap(val, &matchDay)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		matchDays[idx] = &matchDay
	}

	return matchDays
}

func (db DynamoDb) GetMatchDayById(
	tournamentId *string, matchDayId *string) *models.MatchDay {

	record, err := db.getItemByCompoundKey(
		"match-days", "tournament_id", tournamentId, "id", matchDayId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	matchDay := models.MatchDay{}
	err = attr.UnmarshalMap(*record, &matchDay)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &matchDay
}
