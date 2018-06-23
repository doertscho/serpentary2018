package dynamodb

import (
	"log"
	"main/lib"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetMatchesByMatchDayId(
	tournamentId *string, matchDayId *string) []*models.Match {

	result, err := db.queryItemsByKey(
		"matches",
		"tournament_and_match_day_id", models.JoinKeys(tournamentId, matchDayId),
	)
	if err != nil {
		log.Println("error occurred querying match days: " + err.Error())
		return nil
	}

	matches := make([]*models.Match, len(*result))
	for idx, val := range *result {
		match := models.Match{}
		err = attr.UnmarshalMap(val, &match)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		match.TournamentId = *tournamentId
		match.MatchDayId = *matchDayId
		matches[idx] = &match
	}

	return matches
}

func (db DynamoDb) UpdateMatchData(match *models.Match) error {

	match.Updated = lib.Timestamp()

	record, err := attr.MarshalMap(match)
	if err != nil {
		log.Println("Failed to marshal match record: " + err.Error())
		return err
	}
	joinedKeys := models.JoinKeys(&match.TournamentId, &match.MatchDayId)
	record["tournament_and_match_day_id"] = stringAttr(joinedKeys)

	_, err = db.putRecord("matches", &record)
	if err != nil {
		log.Println("Failed to update match record: " + err.Error())
		return err
	}

	return nil
}
