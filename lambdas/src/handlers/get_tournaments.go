package handlers

import (
	"log"
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetTournaments() *events.APIGatewayProxyResponse {
	tournaments := db.GetDb().GetTournaments()
	data := &models.Update{Tournaments: tournaments}
	return lib.BuildUpdate(data)
}

func GetTournamentById(id *string) *events.APIGatewayProxyResponse {

	tournament := db.GetDb().GetTournamentById(id)
	if tournament == nil {
		log.Println("tournament " + *id + " not found in database")
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
