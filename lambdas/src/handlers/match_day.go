package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetMatchDayById(
	tournamentId *string, matchDayId *string) *events.APIGatewayProxyResponse {

	matchDay := db.GetDb().GetMatchDayById(tournamentId, matchDayId)
	if matchDay == nil {
		return lib.NotFound()
	}
	matchDays := []*models.MatchDay{matchDay}
	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)

	data := &models.Update{
		MatchDays: matchDays,
		Matches:   matches,
	}

	return lib.BuildUpdate(data)
}
