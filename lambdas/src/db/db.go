package db

import "main/models"

func InitDatabase() {
	InitDynamoDB()
}

func GetDb() Db {
	return GetDynamoDb()
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
