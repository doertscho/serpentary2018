package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetMatchesByMatchDayId(
	tournamentId *string, matchDayId *string) []*models.Match {

	joinedKey := joinKeys(tournamentId, matchDayId)
	result, err := db.queryItemsByKey("matches", "match_day_id", joinedKey)
	if err != nil {
		log.Println("error occurred querying match days: " + err.Error())
		return nil
	}

	matches := make([]*models.Match, len(result.Items))
	for idx, val := range result.Items {
		match := models.Match{}
		err = attr.UnmarshalMap(val, &match)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		matches[idx] = &match
	}

	return matches
}
