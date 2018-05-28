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
	GetBatchOfUsersByIds(userIds *[]string) []*models.User

	GetPoolById(squadId *string, tournamentId *string) *models.Pool
	GetPoolsBySquadId(squadId *string) []*models.Pool
	AddUserToPool(
		squadId *string, tournamentId *string, userId *string,
	) (*models.Pool, *models.User)

	GetBetsByMatchDayAndSquadId(
		tournamentId *string, matchDayId *string, squadId *string,
	) *models.MatchDayBetBucket
	AddBetToBetBucket(
		tournamentId *string, matchDayId *string, squadId *string,
		userId *string, bet *models.Bet,
	) *models.MatchDayBetBucket
}
