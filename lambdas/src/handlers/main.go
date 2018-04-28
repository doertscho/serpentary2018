package main

import (
	"main/lib"
	"main/models"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func handler(request events.APIGatewayProxyRequest) (
	events.APIGatewayProxyResponse, error) {

	tournaments := []*models.Tournament{
		&models.Tournament{
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
		},
	}

	matchDays := []*models.MatchDay{
		&models.MatchDay{
			Id:           1,
			Updated:      1,
			TournamentId: 1,
		},
		&models.MatchDay{
			Id:           2,
			Updated:      1,
			TournamentId: 1,
		},
	}

	matches := []*models.Match{
		&models.Match{
			Id: 1, Updated: 1, MatchDayId: 1, HomeTeamId: 35, AwayTeamId: 48},
		&models.Match{
			Id: 2, Updated: 1, MatchDayId: 1, HomeTeamId: 12, AwayTeamId: 44},
		&models.Match{
			Id: 3, Updated: 1, MatchDayId: 2, HomeTeamId: 44, AwayTeamId: 12},
		&models.Match{
			Id: 4, Updated: 1, MatchDayId: 2, HomeTeamId: 48, AwayTeamId: 35},
	}

	data := &models.Update{
		Tournaments: tournaments,
		MatchDays:   matchDays,
		Matches:     matches,
	}

	return lib.BuildResponse(data), nil
}

func main() {
	lambda.Start(handler)
}
