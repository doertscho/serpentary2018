package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetBetsByMatchDayAndSquadId(
	tournamentId *string,
	matchDayId *string,
	squadId *string,
	userId *string,
) *events.APIGatewayProxyResponse {

	matchDay := db.GetDb().GetMatchDayById(tournamentId, matchDayId)
	if matchDay == nil {
		return lib.NotFound()
	}
	matchDays := []*models.MatchDay{matchDay}

	pool := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		return lib.NotFound()
	}
	pools := []*models.Pool{pool}

	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)

	users := db.GetDb().GetBatchOfUsersByIds(&pool.Participants)

	betBucket := db.GetDb().GetBetsByMatchDayAndSquadId(
		tournamentId, matchDayId, squadId)
	if betBucket == nil {
		return lib.NotFound()
	}
	censorBets(betBucket, userId, &matches)
	bets := []*models.MatchDayBetBucket{betBucket}

	data := &models.Update{
		MatchDays: matchDays,
		Matches:   matches,
		Bets:      bets,
		Pools:     pools,
		Users:     users,
	}

	return lib.BuildUpdate(data)
}

func censorBets(
	betBucket *models.MatchDayBetBucket,
	userId *string,
	matches *[]*models.Match,
) {

	matchHasBegun := map[uint32]bool{}
	for _, val := range *matches {
		matchHasBegun[val.Id] = lib.MatchHasBegun(val)
	}
	for _, val := range betBucket.Bets {
		if !matchHasBegun[val.MatchId] {
			censorMatchBetBucket(val, userId)
		}
	}
}

func censorMatchBetBucket(
	matchBetBucket *models.MatchBetBucket, userId *string) {

	if userId == nil {
		for _, val := range matchBetBucket.Bets {
			val.HomeGoals = 0
			val.AwayGoals = 0
			val.Status = models.BetStatus_HIDDEN
		}
	} else {
		for _, val := range matchBetBucket.Bets {
			if *userId != val.UserId {
				val.HomeGoals = 0
				val.AwayGoals = 0
				val.Status = models.BetStatus_HIDDEN
			}
		}
	}
}
