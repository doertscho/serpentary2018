package handlers

import (
	"main/db"
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func DispatchMatchDayRequest(path []string) events.APIGatewayProxyResponse {
	if matchDayId, rest := lib.MatchInt(path); matchDayId != nil {
		if len(rest) == 0 {
			return getMatchDayById(*matchDayId)
		}
	}
	return lib.BadRequest("Expected integer match day ID.")
}

func getMatchDayById(id int) events.APIGatewayProxyResponse {

	matchDay := db.GetDb().GetMatchDayById(id)
	if matchDay == nil {
		return lib.NotFound()
	}
	matchDays := []*models.MatchDay{matchDay}
	matches := db.GetDb().GetMatchesByMatchDayId(id)

	data := &models.Update{
		MatchDays: matchDays,
		Matches:   matches,
	}

	return lib.BuildUpdate(data)
}
