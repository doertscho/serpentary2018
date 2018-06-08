package handlers

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
	"github.com/golang/protobuf/proto"
)

func GetMe(userId *string) *events.APIGatewayProxyResponse {

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		log.Println("User does not exist in database: " + *userId)
		user = db.GetDb().RegisterNewUser(userId)
	}

	jsonDebug, err := json.Marshal(user)
	if err == nil {
		log.Println("Got user from database: " + string(jsonDebug))
	}

	data := &models.Update{Users: []*models.User{user}}
	return lib.BuildUpdate(data)
}

func UpdatePreferredName(
	userId *string, data *string,
) *events.APIGatewayProxyResponse {

	user, err := decodeUserPayload(data)
	if err != nil {
		return lib.BadRequest(err.Error())
	}

	if len(user.PreferredName) == 0 {
		return lib.BadRequest("No preferred name was provided")
	}

	userFromDb := db.GetDb().UpdatePreferredNameForUser(
		userId, &user.PreferredName)
	if userFromDb == nil {
		log.Println("Failed to update user's preferred name")
		return lib.InternalError()
	}

	pools := make([]*models.Pool, len(userFromDb.Pools))
	for i, poolId := range userFromDb.Pools {
		parts := models.SplitKey(&poolId)
		if len(*parts) != 2 {
			return lib.InternalError()
		}
		squadId := (*parts)[0]
		tournamentId := (*parts)[1]
		pool := db.GetDb().UpdatePreferredNameForUserOnPool(
			&squadId, &tournamentId, userId, &user.PreferredName)
		if pool == nil {
			return lib.InternalError()
		}
		pools[i] = pool
	}

	squads := make([]*models.Squad, len(userFromDb.Squads))
	for i, squadId := range userFromDb.Squads {
		squad := db.GetDb().UpdatePreferredNameForUserOnSquad(
			&squadId, userId, &user.PreferredName)
		if squad == nil {
			return lib.InternalError()
		}
		squads[i] = squad
	}

	responseData := &models.Update{
		Users:  []*models.User{userFromDb},
		Pools:  pools,
		Squads: squads,
	}
	return lib.BuildUpdate(responseData)
}

func decodeUserPayload(data *string) (*models.User, error) {

	if data == nil {
		log.Println("No payload was provided")
		return nil, errors.New("Did not receive any payload")
	}

	decodedBytes, err := base64.StdEncoding.DecodeString(*data)
	if err != nil {
		log.Println("Could not decode base64 payload")
		return nil, errors.New("Could not decode payload")
	}

	user := models.User{}
	err = proto.Unmarshal(decodedBytes, &user)
	if err != nil {
		log.Println("Could not decode protobuf payload")
		return nil, errors.New("Could not decode payload")
	}
	return &user, nil
}
