package dynamodb

import (
	"log"
	"main/models"
	"strconv"

	sdk "github.com/aws/aws-sdk-go/service/dynamodb"
)

func (db DynamoDb) GetFullTeamDataByTournamentId(
	tournamentId *string,
) *[]*models.Team {

	record, err := db.getItemByKey("teams", "tournament_id", tournamentId)
	if err != nil {
		log.Println("error occurred querying item: " + err.Error())
		return nil
	}

	updated := 0
	updatedVal := (*record)["updated"]
	if updatedVal != nil && updatedVal.N != nil {
		updated, _ = strconv.Atoi(*updatedVal.N)
	}

	teams := unmarshalTeams((*record)["teams"], tournamentId, uint32(updated))
	if teams == nil {
		teams = &[]*models.Team{}
	}

	return teams
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

		name := &models.LocalisableString{}
		name.UnmarshalDynamoDBAttributeValue(teamMap["name"])
		players := unmarshalPlayers(teamMap["players"])
		if players == nil {
			players = &[]*models.Player{}
		}

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
