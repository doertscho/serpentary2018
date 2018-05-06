package handlers

import (
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
)

func GetMatchDayById(id int) events.APIGatewayProxyResponse {

	if id != 1 {
		return lib.NotFound()
	}

	matchDays := []*models.MatchDay{
		getSampleMatchDay1(),
	}

	matches := []*models.Match{
		getSampleMatch1(),
		getSampleMatch2(),
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
