package handlers

import (
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

	tournaments := []*models.Tournament{getSampleTournament1()}

	data := &models.Update{Tournaments: tournaments}

	return lib.BuildResponse(data)
}

func getTournamentById(id int) events.APIGatewayProxyResponse {

	if id != 1 {
		return lib.NotFound()
	}

	tournaments := []*models.Tournament{getSampleTournament1()}
	matchDays := []*models.MatchDay{
		getSampleMatchDay1Partial(),
		getSampleMatchDay2Partial(),
	}

	data := &models.Update{
		Tournaments: tournaments,
		MatchDays:   matchDays,
	}

	return lib.BuildResponse(data)
}

func getSampleTournament1() *models.Tournament {
	return &models.Tournament{
		Id:      1,
		Updated: 1,
		Name: &models.LocalisableString{
			Localisations: []*models.Localisation{
				&models.Localisation{
					Locale: models.Locale_EN,
					Value:  "Tournament 1",
				},
				&models.Localisation{
					Locale: models.Locale_DE,
					Value:  "Wettbewerb 1",
				},
			},
		},
	}
}

func getSampleMatchDay1Partial() *models.MatchDay {
	return &models.MatchDay{
		Id:           1,
		Updated:      1,
		TournamentId: 1,
	}
}

func getSampleMatchDay2Partial() *models.MatchDay {
	return &models.MatchDay{
		Id:           2,
		Updated:      1,
		TournamentId: 1,
	}
}
