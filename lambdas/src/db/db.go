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
	GetTournamentById(tournamentId *int) *models.Tournament

	GetMatchDaysByTournamentId(tournamentId *int) []*models.MatchDay
	GetMatchDayById(matchDayId *int) *models.MatchDay

	GetMatchesByMatchDayId(matchDayid *int) []*models.Match

	GetUserById(userId *string) *models.User
	RegisterNewUser(userId *string) *models.User
}
