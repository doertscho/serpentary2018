package lib

import "main/models"

const BET_TIME_OUT_SECONDS = 300

func MatchHasBegun(match *models.Match) bool {
	if match == nil || match.KickOff == 0 {
		return false
	}
	return DeadlineHasPassed(match.KickOff - BET_TIME_OUT_SECONDS)
}

func DeadlineHasPassed(time uint32) bool {
	return time < Timestamp()
}

const EXACT_POINTS = 5
const DIFFERENCE_POINTS = 4
const TENDENCY_POINTS = 3

func IsExact(bet *models.Bet, match *models.Match) bool {
	return bet.HomeGoals == match.HomeGoals && bet.AwayGoals == match.AwayGoals
}

func IsCorrectDifference(bet *models.Bet, match *models.Match) bool {
	return (match.HomeGoals != match.AwayGoals) &&
		((bet.HomeGoals - bet.AwayGoals) == (match.HomeGoals - match.AwayGoals))
}

func IsCorrectTendency(bet *models.Bet, match *models.Match) bool {
	return (bet.HomeGoals < bet.AwayGoals && match.HomeGoals < match.AwayGoals) ||
		(bet.HomeGoals > bet.AwayGoals && match.HomeGoals > match.AwayGoals) ||
		(bet.HomeGoals == bet.AwayGoals && match.HomeGoals == match.AwayGoals)
}
