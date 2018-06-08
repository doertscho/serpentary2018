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
	GetTournamentById(tournamentId *string) (*models.Tournament, *[]*models.Team)

	GetFullTeamDataByTournamentId(tournamentId *string) *[]*models.Team

	GetMatchDaysByTournamentId(tournamentId *string) []*models.MatchDay
	GetMatchDayById(tournamentId *string, matchDayId *string) *models.MatchDay

	GetMatchesByMatchDayId(
		tournamentId *string, matchDayId *string) []*models.Match

	GetSquadById(squadId *string) (*models.Squad, *[]*models.User)
	AddUserToSquad(squadId *string, userId *string) (*models.Squad, *models.User)
	UpdatePreferredNameForUserOnSquad(
		squadId *string,
		userId *string, preferredName *string,
	) *models.Squad

	GetUserById(userId *string) *models.User
	RegisterNewUser(userId *string) *models.User
	UpdatePreferredNameForUser(userId *string, preferredName *string) *models.User

	GetPoolById(
		squadId *string, tournamentId *string,
	) (*models.Pool, *[]*models.User)
	GetExtraBetsByPoolId(
		squadId *string, tournamentId *string,
	) *models.ExtraQuestionBetBucket
	GetPoolsBySquadId(squadId *string) []*models.Pool
	AddUserToPool(
		squadId *string, tournamentId *string, userId *string,
	) (*models.Pool, *models.User)
	AddBetsToExtraQuestionBetBucket(
		squadId *string, tournamentId *string,
		userId *string, bets *models.ExtraQuestionUserBetBucket,
	) *models.ExtraQuestionBetBucket
	UpdatePreferredNameForUserOnPool(
		squadId *string, tournamentId *string,
		userId *string, preferredName *string,
	) *models.Pool

	GetBetsByMatchDayAndSquadId(
		tournamentId *string, matchDayId *string, squadId *string,
	) *models.MatchDayBetBucket
	AddBetToBetBucket(
		tournamentId *string, matchDayId *string, squadId *string,
		userId *string, bet *models.Bet,
	) *models.MatchDayBetBucket
}
