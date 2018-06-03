package handlers

import (
	"encoding/base64"
	"errors"
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/protobuf/proto"
)

func SubmitBet(
	squadId *string,
	tournamentId *string,
	matchDayId *string,
	userId *string,
	data *string,
) *events.APIGatewayProxyResponse {

	bet, err := decodeBetPayload(data)
	if err != nil {
		return lib.BadRequest(err.Error())
	}

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
	if !userRegisteredForPool(userId, pool) {
		log.Println("User is not registered for this pool")
		return lib.Forbidden(
			"You are not registered for this pool, please register first")
	}

	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)
	match := findMatchWithId(bet.MatchId, matches)
	if match == nil {
		log.Println("Bet was submitted for non-existing match")
		return lib.NotFound()
	}
	if lib.MatchHasBegun(match) {
		log.Println("Bet was submitted too late!")
		return lib.Gone(
			"Bet was submitted too late and missed the deadline for this match")
	}

	betBucket := db.GetDb().AddBetToBetBucket(
		tournamentId, matchDayId, squadId, userId, bet)
	if betBucket == nil {
		return lib.NotFound()
	}

	censorBets(betBucket, userId, &matches)

	bets := []*models.MatchDayBetBucket{betBucket}
	pools := []*models.Pool{pool}
	update := &models.Update{
		Matches: matches,
		Bets:    bets,
		Pools:   pools,
		Users:   *users,
	}

	return lib.BuildUpdate(update)
}

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

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		return lib.NotFound()
	}
	pools := []*models.Pool{pool}

	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)

	betBucket := db.GetDb().GetBetsByMatchDayAndSquadId(
		tournamentId, matchDayId, squadId)
	if betBucket == nil {
		return lib.NotFound()
	}
	censorBets(betBucket, userId, &matches)
	bets := []*models.MatchDayBetBucket{betBucket}

	tournament, teams := db.GetDb().GetTournamentById(tournamentId)
	if tournament == nil {
		return lib.NotFound()
	}
	if teams == nil {
		teams = &[]*models.Team{}
	}
	tournaments := []*models.Tournament{tournament}

	data := &models.Update{
		MatchDays:   matchDays,
		Matches:     matches,
		Bets:        bets,
		Pools:       pools,
		Users:       *users,
		Tournaments: tournaments,
		Teams:       *teams,
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
	if userId == nil {
		log.Println("No user id given - censoring all pending bets")
		for _, val := range betBucket.Bets {
			censorUserBetBucket(val, &matchHasBegun)
		}
	} else {
		log.Println("Censoring all pending bets except for user " + *userId)
		for _, val := range betBucket.Bets {
			if *userId != val.UserId {
				censorUserBetBucket(val, &matchHasBegun)
			}
		}
	}
}

func censorUserBetBucket(
	userBetBucket *models.UserBetBucket, matchHasBegun *map[uint32]bool) {

	for _, val := range userBetBucket.Bets {
		if !(*matchHasBegun)[val.MatchId] {
			val.HomeGoals = 0
			val.AwayGoals = 0
			val.Status = models.BetStatus_HIDDEN
		}
	}
}

func decodeBetPayload(data *string) (*models.Bet, error) {

	if data == nil {
		log.Println("No payload was provided")
		return nil, errors.New("Did not receive any payload")
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(*data)
	if err != nil {
		log.Println("Could not decode base64 payload")
		return nil, errors.New("Could not decode payload")
	}

	bet := models.Bet{}
	err = proto.Unmarshal(decodedBytes, &bet)
	if err != nil {
		log.Println("Could not decode protobuf payload")
		return nil, errors.New("Could not decode payload")
	}
	if bet.MatchId == 0 {
		log.Println("Payload did not contain match id")
		return nil, errors.New("Payload did not contain match id")
	}
	return &bet, nil
}

func userRegisteredForPool(userId *string, pool *models.Pool) bool {
	if pool == nil {
		return false
	}
	for _, val := range pool.Participants {
		if val == *userId {
			return true
		}
	}
	return false
}

func findMatchWithId(matchId uint32, matches []*models.Match) *models.Match {
	for _, val := range matches {
		if val.Id == matchId {
			return val
		}
	}
	return nil
}
