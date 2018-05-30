package dynamodb

import (
	"log"
	"main/models"
	"strconv"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
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

func unmarshalTeams(
	teamsValue *sdk.AttributeValue,
	tournamentId *string,
	updated uint32,
) *[]*models.Team {

	if teamsValue == nil || teamsValue.M == nil {
		return nil
	}

	teams := make([]*models.Team, len(teamsValue.M))
	i := 0
	for id, entry := range teamsValue.M {
		teamMap := entry.M
		if teamMap == nil {
			return nil
		}

		name := unmarshalLocalisableString(teamMap["name"])
		players := unmarshalPlayers(teamMap["players"])

		team := models.Team{
			Updated:      updated,
			TournamentId: *tournamentId,
			Id:           id,
			Name:         name,
			Players:      *players,
		}
		teams[i] = &team
		i = i + 1
	}
	return &teams
}

func unmarshalPlayers(
	playersValue *sdk.AttributeValue) *[]*models.Player {

	if playersValue == nil || playersValue.M == nil {
		return nil
	}

	players := make([]*models.Player, len(playersValue.M))
	i := 0
	for key, nameValue := range playersValue.M {

		id, err := strconv.Atoi(key)
		if err != nil {
			log.Println("Invalid player id: " + key)
			return nil
		}

		name := ""
		if nameValue.S != nil {
			name = *nameValue.S
		}

		player := models.Player{
			Id:   uint32(id),
			Name: name,
		}
		players[i] = &player
		i = i + 1
	}
	return &players
}

func unmarshalLocalisableString(
	stringValue *sdk.AttributeValue) *models.LocalisableString {

	if stringValue == nil || stringValue.M == nil {
		return nil
	}
	name := &models.LocalisableString{}
	err := attr.UnmarshalMap(stringValue.M, &name)
	if err != nil {
		log.Println("Failed to unmarshal localisable string: " + err.Error())
		return nil
	}

	return name
}
