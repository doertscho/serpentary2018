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

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
	if pool == nil {
		log.Println("Pool " + *tournamentId + " / " + *squadId +
			" not found in database")
		return lib.NotFound()
	}

	tournament, teams := db.GetDb().GetTournamentById(tournamentId)
	if tournament == nil {
		log.Println("Tournament " + *tournamentId + " not found in database")
		tournament = &models.Tournament{}
	}

	matchDays := db.GetDb().GetMatchDaysByTournamentId(tournamentId)

	pools := []*models.Pool{pool}
	tournaments := []*models.Tournament{tournament}
	data := &models.Update{
		Pools:       pools,
		Tournaments: tournaments,
		MatchDays:   matchDays,
		Teams:       *teams,
		Users:       *users,
	}

	return lib.BuildUpdate(data)
}

func AddUserToPool(
	squadId *string, tournamentId *string, userId *string,
) *events.APIGatewayProxyResponse {

	pool, users := db.GetDb().GetPoolById(squadId, tournamentId)
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
	*users = append(*users, user)

	squads := []*models.Squad{}
	if !lib.SliceContains(user.Squads, *squadId) {
		squad, user := db.GetDb().AddUserToSquad(squadId, userId)
		if squad == nil {
			return lib.InternalError()
		}
		squads = []*models.Squad{squad}
		*users = append(*users, user)
	}

	data := &models.Update{
		Pools:  []*models.Pool{pool},
		Users:  *users,
		Squads: squads,
	}
	return lib.BuildUpdate(data)
}
