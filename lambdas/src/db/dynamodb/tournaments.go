package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetTournaments() []*models.Tournament {

	result, err := db.query("tournaments", "true", NO_VALUES)
	if err != nil {
		log.Println("error occurred querying tournaments: " + err.Error())
		return nil
	}

	tournaments := make([]*models.Tournament, len(result.Items))
	for idx, val := range result.Items {
		tournament := models.Tournament{}
		err = attr.UnmarshalMap(val, &tournament)
		if err != nil {
			log.Println("error unmarshalling item: " + err.Error())
			return nil
		}
		tournaments[idx] = &tournament
	}

	return tournaments
}

func (db DynamoDb) GetTournamentById(tournamentId *string) *models.Tournament {

	record, err := db.getItemById("tournaments", tournamentId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	tournament := models.Tournament{}
	err = attr.UnmarshalMap(record.Item, &tournament)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil
	}

	return &tournament
}
