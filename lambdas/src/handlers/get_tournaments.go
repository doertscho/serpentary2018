package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func DispatchTournamentRequest(path []string) events.APIGatewayProxyResponse {
	if len(path) == 0 {
		return getTournaments()
	}
	if tournamentId, _ := lib.MatchInt(path); tournamentId != nil {
		return getTournamentById(*tournamentId)
	}
	return lib.BadRequest("Expected integer tournament ID.")
}

func getTournaments() events.APIGatewayProxyResponse {
	tournaments := db.GetDb().GetTournaments()
	data := &models.Update{Tournaments: tournaments}
	return lib.BuildUpdate(data)
}

func getTournamentById(id int) events.APIGatewayProxyResponse {

	tournament := db.GetDb().GetTournamentById(id)
	if tournament == nil {
		return lib.NotFound()
	}
	tournaments := []*models.Tournament{tournament}

	matchDays := db.GetDb().GetMatchDaysByTournamentId(id)

	data := &models.Update{
		Tournaments: tournaments,
		MatchDays:   matchDays,
	}

	return lib.BuildUpdate(data)
}
