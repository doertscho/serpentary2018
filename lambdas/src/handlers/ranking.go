package handlers

import (
	"errors"
	"main/db"
	"main/models"
)

func calculateRanking(
	tournamentId *string, matchDayId *string, updatedMatch *models.Match,
) error {

	matchDay := db.GetDb().GetMatchDayById(tournamentId, matchDayId)
	if matchDay == nil {
		return errors.New("Could not load match day data")
	}
	previousMatchDayId = &matchDay.PreviousId
	if matchDay.PreviousId == "" {
		previousMatchDayId = nil
	}

	matches := db.GetDb().GetMatchesByMatchDayId(tournamentId, matchDayId)
	for idx, value := range matches {
		if value.Id == updatedMatch.Id {
			matches[idx] = updatedMatch
			break
		}
	}

	betBuckets := db.GetDb().GetBetsByMatchDay(tournamentId, matchDayId)
	for _, squadBets := range betBuckets {
		err := calculateRankingForSquad(
			tournamentId, matchDayId, previousMatchDayId, matches, squadBets)
		if err != nil {
			return err
		}
	}

	return nil
}

func calculateRankingForSquad(
	tournamentId *string, matchDayId *string, previousMatchDayId *string,
	matches []*models.Match, bets *models.MatchDayBetBucket,
) error {

	pool := db.GetDb().GetPoolById(bets.SquadId, tournamentId)

	return nil
}
