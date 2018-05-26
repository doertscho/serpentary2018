import { createSelector, ParametricSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, joinKeys } from '../types/data'
import {
  getMatches,
  getMatchDays,
  getMatchesByMatchDay,
  getSquads,
  getBets
} from './data'
import {
  makeGetUrlParameter,
  makeGetNumberUrlParameter,
  NumberSelector,
  StringSelector,
  ModelSelector
} from './util'

export function makeGetMatchDay(
  getTournamentId: StringSelector,
  getMatchDayId: StringSelector
): ModelSelector<m.MatchDay> {
  return createSelector(
    [getMatchDays, getTournamentId, getMatchDayId],
    (   matches,      tournamentId,    matchDayId) =>
      matches[joinKeys(tournamentId, matchDayId)]
  )
}

export function makeGetMatches(
  getMatchDay: ModelSelector<m.MatchDay>
): ModelSelector<m.Match[]> {
  return createSelector(
    [getMatches, getMatchesByMatchDay, getMatchDay],
    (   matches,    matchesByMatchDay,    matchDay) => {
      let combinedKey = joinKeys(matchDay.tournamentId, matchDay.id)
      let matchIds = matchesByMatchDay[combinedKey]
      if (!matchIds) return null
      return matchIds.map(matchId => matches[matchId])
    }
  )
}

export function makeGetSquad(
  getSquadId: StringSelector
): ModelSelector<m.Squad> {
  return createSelector(
    [getSquads, getSquadId],
    (   squads,    squadId) => squads[squadId]
  )
}

export function makeGetMatchDayBetBucket(
  getSquadId: StringSelector,
  getTournamentId: StringSelector,
  getMatchDayId: StringSelector
): ModelSelector<m.MatchDayBetBucket> {
  return createSelector(
    [getSquadId, getTournamentId, getMatchDayId, getBets],
    (   squadId,    tournamentId,    matchDayId,    bets) => {
      return bets[joinKeys(squadId, tournamentId, matchDayId)]
    }
  )
}

export function makeGetBetsByMatch(
  getParticipants: ModelSelector<m.User[]>,
  getMatches: ModelSelector<m.Match[]>,
  getMatchDayBetBucket: ModelSelector<m.MatchDayBetBucket>
): ModelSelector<m.IBet[][]> {
  return createSelector(
    [getParticipants, getMatches, getMatchDayBetBucket],
    (   participants,    matches,    matchDayBetBucket) => {
      var betsInBucket: m.IMatchBetBucket[] = []
      if (matchDayBetBucket && matchDayBetBucket.bets)
        betsInBucket = matchDayBetBucket.bets
      let betsByMatch: m.IBet[][] = []
      betsInBucket.forEach(matchBetBucket => {
        let matchBetsByUserId: Map<m.IBet> = {}
        matchBetBucket.bets.forEach(bet => {
          matchBetsByUserId[bet.userId] = bet
        })
        let matchBets = participants.map(user =>
          matchBetsByUserId[user.id] || missingBetForUser(user))
        betsByMatch[matchBetBucket.matchId] = matchBets
      })
      matches.forEach(match => {
        if (!betsByMatch[match.id])
          betsByMatch[match.id] = participants.map(missingBetForUser)
      })
      return betsByMatch
    }
  )
}

const missingBetForUser = (user: m.User) =>
    m.Bet.create({ userId: user.id, status: m.BetStatus.MISSING })
