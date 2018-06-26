package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetRankingByMatchDayAndSquadId(
	tournamentId *string, matchDayId *string, squadId *string,
) *models.RankingTable {

	if tournamentId == nil || matchDayId == nil || squadId == nil {
		return nil
	}

	record, err := db.getItemByCompoundKey(
		"rankings",
		"squad_id", squadId,
		"tournament_and_match_day_id", models.JoinKeys(tournamentId, matchDayId),
	)
	if err != nil {
		log.Println("Error occurred querying ranking record: " + err.Error())
		return nil
	}

	rankingTable := &models.RankingTable{}
	err = attr.UnmarshalMap(*record, rankingTable)

	return rankingTable
}

func (db DynamoDb) WriteRankingTable(table *models.RankingTable) error {

	if table == nil {
		return nil
	}

	record, err := attr.MarshalMap(table)
	if err != nil {
		log.Println("Failed to marshal record: " + err.Error())
		return err
	}
	record["tournament_and_match_day_id"] =
		stringAttr(models.JoinKeys(&table.TournamentId, &table.MatchDayId))

	_, err = db.putRecord("rankings", &record)
	if err != nil {
		log.Println("Failed to create user entry: " + err.Error())
		return err
	}

	return nil
}
