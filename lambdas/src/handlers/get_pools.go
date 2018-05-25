package handlers

import (
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetPoolById(
	squadId *string, tournamentId *string) *events.APIGatewayProxyResponse {

	pool := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		log.Println("Pool " + *tournamentId + " / " + *squadId +
			" not found in database")
		return lib.NotFound()
	}
	pools := []*models.Pool{pool}

	tournament := db.GetDb().GetTournamentById(tournamentId)
	if tournament == nil {
		log.Println("Tournament " + *tournamentId + " not found in database")
		tournament = &models.Tournament{}
	}
	tournaments := []*models.Tournament{tournament}

	data := &models.Update{
		Pools:       pools,
		Tournaments: tournaments,
	}

	return lib.BuildUpdate(data)
}

func AddUserToPool(
	squadId *string, tournamentId *string, userId *string,
) *events.APIGatewayProxyResponse {

	pool := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		return lib.NotFound()
	}

	user := db.GetDb().GetUserById(userId)
	if user == nil {
		return lib.NotFound()
	}

	if !lib.SliceContains(pool.Participants, *userId) {
		pool, user = db.GetDb().AddUserToPool(squadId, tournamentId, userId)
		if pool == nil {
			return lib.InternalError()
		}
	}

	data := &models.Update{
		Pools: []*models.Pool{pool},
		Users: []*models.User{user},
	}
	return lib.BuildUpdate(data)
}
