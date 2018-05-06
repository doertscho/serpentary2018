package handlers

import (
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

	var matchDays []*models.MatchDay
	var matches []*models.Match
	if id == 1 {
		matchDays = []*models.MatchDay{
			getSampleMatchDay1(),
		}
		matches = []*models.Match{
			getSampleMatch1(),
			getSampleMatch2(),
		}
	} else if id == 2 {
		matchDays = []*models.MatchDay{
			getSampleMatchDay2(),
		}
		matches = []*models.Match{
			getSampleMatch3(),
			getSampleMatch4(),
		}
	} else {
		return lib.NotFound()
	}

	data := &models.Update{
		MatchDays: matchDays,
		Matches:   matches,
	}

	return lib.BuildResponse(data)
}

func getSampleMatchDay1() *models.MatchDay {
	return &models.MatchDay{
		Id:           1,
		Updated:      1,
		TournamentId: 1,
	}
}

func getSampleMatchDay2() *models.MatchDay {
	return &models.MatchDay{
		Id:           2,
		Updated:      1,
		TournamentId: 1,
	}
}

func getSampleMatch1() *models.Match {
	return &models.Match{
		Id: 1, Updated: 1, MatchDayId: 1, HomeTeamId: 35, AwayTeamId: 48}
}

func getSampleMatch2() *models.Match {
	return &models.Match{
		Id: 2, Updated: 1, MatchDayId: 1, HomeTeamId: 12, AwayTeamId: 44}
}

func getSampleMatch3() *models.Match {
	return &models.Match{
		Id: 3, Updated: 1, MatchDayId: 2, HomeTeamId: 44, AwayTeamId: 12}
}

func getSampleMatch4() *models.Match {
	return &models.Match{
		Id: 4, Updated: 1, MatchDayId: 2, HomeTeamId: 48, AwayTeamId: 35}
}
