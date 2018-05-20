package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetSquadById(squadId *string) *events.APIGatewayProxyResponse {

	squad := db.GetDb().GetSquadById(squadId)
	if squad == nil {
		return lib.NotFound()
	}
	squads := []*models.Squad{squad}

	data := &models.Update{
		Squads: squads,
	}

	return lib.BuildUpdate(data)
}

func AddUserToSquad(
	squadId *string, userId *string,
) *events.APIGatewayProxyResponse {

	squad := db.GetDb().GetSquadById(squadId)
	if squad == nil {
		return lib.NotFound()
	}

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		return lib.NotFound()
	}

	if !lib.SliceContains(squad.Members, *userId) {
		squad, user = db.GetDb().AddUserToSquad(squadId, userId)
		if squad == nil {
			return lib.InternalError()
		}
	}

	data := &models.Update{
		Squads: []*models.Squad{squad},
		Users:  []*models.User{user},
	}
	return lib.BuildUpdate(data)
}
