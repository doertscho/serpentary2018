package db

import (
	"main/db/dynamodb"
	"main/models"
)

var instance Db = nil

func InitDatabase() {
	instance = dynamodb.GetDynamoDb()
}

func GetDb() Db {
	if instance == nil {
		InitDatabase()
	}
	return instance
}

type Db interface {
	GetTournaments() []*models.Tournament
	GetTournamentById(tournamentId *string) *models.Tournament

	GetMatchDaysByTournamentId(tournamentId *string) []*models.MatchDay
	GetMatchDayById(tournamentId *string, matchDayId *string) *models.MatchDay

	GetMatchesByMatchDayId(
		tournamentId *string, matchDayId *string) []*models.Match

	GetSquadById(squadId *string) *models.Squad
	AddUserToSquad(squadId *string, userId *string) (*models.Squad, *models.User)

	GetUserById(userId *string) *models.User
	RegisterNewUser(userId *string) *models.User
}
