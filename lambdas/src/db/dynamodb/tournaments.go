package dynamodb

import (
	"log"
	"main/models"

	attr "github.com/aws/aws-sdk-go/service/dynamodb/dynamodbattribute"
)

func (db DynamoDb) GetTournaments() []*models.Tournament {

	result, err := db.scanTable("tournaments")
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

func (db DynamoDb) GetTournamentById(
	tournamentId *string) (*models.Tournament, *[]*models.Team) {

	record, err := db.getItemById("tournaments", tournamentId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil, nil
	}

	tournament := models.Tournament{}
	err = attr.UnmarshalMap(*record, &tournament)
	if err != nil {
		log.Println("error unmarshalling item: " + err.Error())
		return nil, nil
	}

	teams := unmarshalTeams((*record)["teams"], tournamentId, tournament.Updated)
	if teams == nil {
		teams = &[]*models.Team{}
	}

	return &tournament, teams
}
