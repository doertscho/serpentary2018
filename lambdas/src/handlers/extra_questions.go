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

func SubmitExtraQuestionBet(
	squadId *string,
	tournamentId *string,
	userId *string,
	data *string,
) *events.APIGatewayProxyResponse {

	bets, err := decodeExtraQuestionBetPayload(data)
	if err != nil {
		return lib.BadRequest(err.Error())
	}

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
	if !userRegisteredForPool(userId, pool) {
		log.Println("User is not registered for this pool")
		return lib.Forbidden(
			"You are not registered for this pool, please register first")
	}

	tournament, teams := db.GetDb().GetTournamentById(tournamentId)
	if tournament == nil {
		return lib.NotFound()
	}

	betBucket := db.GetDb().AddBetsToExtraQuestionBetBucket(
		squadId, tournamentId, userId, bets)
	if betBucket == nil {
		return lib.NotFound()
	}

	if !lib.DeadlineHasPassed(pool.ExtraQuestionDeadline) {
		censorExtraQuestionBets(betBucket, userId)
	}

	extraQuestionBets := []*models.ExtraQuestionBetBucket{betBucket}
	pools := []*models.Pool{pool}
	update := &models.Update{
		ExtraQuestionBets: extraQuestionBets,
		Pools:             pools,
		Users:             *users,
		Teams:             *teams,
	}

	return lib.BuildUpdate(update)
}

func censorExtraQuestionBets(
	betBucket *models.ExtraQuestionBetBucket, userId *string) {

	if userId == nil {
		log.Println("No user id given - censoring all special question bets")
		for _, val := range betBucket.Bets {
			censorExtraQuestionUserBetBucket(val)
		}
	} else {
		log.Println(
			"Censoring all special question bets except for user " + *userId)
		for _, val := range betBucket.Bets {
			if *userId != val.UserId {
				censorExtraQuestionUserBetBucket(val)
			}
		}
	}
}

func censorExtraQuestionUserBetBucket(
	userBetBucket *models.ExtraQuestionUserBetBucket) {

	for _, val := range userBetBucket.Bets {
		val.Text = ""
		val.TeamId = ""
		val.PlayerId = 0
		val.Status = models.BetStatus_HIDDEN
	}
}

func decodeExtraQuestionBetPayload(
	data *string) (*models.ExtraQuestionUserBetBucket, error) {

	if data == nil {
		log.Println("No payload was provided")
		return nil, errors.New("Did not receive any payload")
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(*data)
	if err != nil {
		log.Println("Could not decode base64 payload")
		return nil, errors.New("Could not decode payload")
	}

	bets := models.ExtraQuestionUserBetBucket{}
	err = proto.Unmarshal(decodedBytes, &bets)
	if err != nil {
		log.Println("Could not decode protobuf payload")
		return nil, errors.New("Could not decode payload")
	}
	return &bets, nil
}
