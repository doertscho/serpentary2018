import { models as m } from '../types/models'

export const EXACT_POINTS = 5
export const DIFFERENCE_POINTS = 4
export const TENDENCY_POINTS = 3

const BET_TIME_OUT_SECONDS = 300

export const now = () => Math.floor(new Date().getTime() / 1000)

export const secondsToTimeout = (match: m.Match) => {
  let kickOff = match.kickOff || 0
  return kickOff - BET_TIME_OUT_SECONDS - now()
}

export const canEnterBets = (match: m.Match) => secondsToTimeout(match) > 0

export const deadlineHasPassed = (timestamp: number) => timestamp < now()

export const isExact = (bet: m.Bet, match: m.Match) =>
  bet.homeGoals == match.homeGoals && bet.awayGoals == match.awayGoals

export const isCorrectDifference = (bet: m.Bet, match: m.Match) =>
  ((bet.homeGoals - bet.awayGoals) == (match.homeGoals - match.awayGoals)) &&
  (match.homeGoals != match.awayGoals)

export const isCorrectTendency = (bet: m.Bet, match: m.Match) =>
  (bet.homeGoals < bet.awayGoals && match.homeGoals < match.awayGoals) ||
  (bet.homeGoals > bet.awayGoals && match.homeGoals > match.awayGoals) ||
  (bet.homeGoals == bet.awayGoals && match.homeGoals == match.awayGoals)
