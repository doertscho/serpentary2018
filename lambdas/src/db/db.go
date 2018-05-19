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
	GetTournamentById(tournamentId int) *models.Tournament

	GetMatchDaysByTournamentId(tournamentId int) []*models.MatchDay
	GetMatchDayById(matchDayId int) *models.MatchDay

	GetMatchesByMatchDayId(matchDayid int) []*models.Match

	GetUserByName(userName string) *models.User
	RegisterNewUser(userName string) *models.User
}
