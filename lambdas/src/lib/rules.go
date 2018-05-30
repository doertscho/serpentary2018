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
