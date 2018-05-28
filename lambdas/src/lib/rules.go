package lib

import "main/models"

const BET_TIME_OUT_SECONDS = 300

func MatchHasBegun(match *models.Match) bool {
	if match == nil || match.KickOff == 0 {
		return false
	}
	return (match.KickOff - BET_TIME_OUT_SECONDS) < Timestamp()
}
