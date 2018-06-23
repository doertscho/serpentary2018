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

func UpdateMatchData(
	tournamentId *string, matchDayId *string, matchId *string,
	userId *string, data *string,
) *events.APIGatewayProxyResponse {

	log.Println("Updating match data for " + *matchDayId + "/" + *matchId)

	match, err := decodeMatchPayload(data)
	if err != nil {
		return lib.BadRequest(err.Error())
	}

	if len(match.TournamentId) == 0 || len(match.MatchDayId) == 0 {
		return lib.BadRequest("Did not receive full match identifier")
	}

	err = db.GetDb().UpdateMatchData(match)
	if err != nil {
		return lib.InternalError()
	}

	matches := []*models.Match{match}
	update := &models.Update{Matches: matches}
	return lib.BuildUpdate(update)
}

func decodeMatchPayload(data *string) (*models.Match, error) {

	if data == nil {
		log.Println("No payload was provided")
		return nil, errors.New("Did not receive any payload")
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(*data)
	if err != nil {
		log.Println("Could not decode base64 payload")
		return nil, errors.New("Could not decode payload")
	}

	match := models.Match{}
	err = proto.Unmarshal(decodedBytes, &match)
	if err != nil {
		log.Println("Could not decode protobuf payload")
		return nil, errors.New("Could not decode payload")
	}
	if match.Id == 0 {
		log.Println("Payload did not contain match id")
		return nil, errors.New("Payload did not contain match id")
	}
	return &match, nil
}
