import { createSelector, ParametricSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import {
  getMatches,
  getMatchDays,
  getMatchesByMatchDay,
  getSquads,
  getBets,
  getBetsByMatchDayAndPool
} from './data'
import {
  makeGetUrlParameter,
  makeGetNumberUrlParameter,
  NumberSelector,
  StringSelector,
  ModelSelector
} from './util'

export const makeGetMatchDay = (getMatchDayId: NumberSelector) =>
  createSelector(
    [getMatchDays, getMatchDayId],
    (   matches,      matchDayId) =>

      matches[matchDayId]
  )

export const makeGetMatches = (getMatchDayId: NumberSelector) =>
  createSelector(
    [getMatches, getMatchesByMatchDay, getMatchDayId],
    (   matches,    matchesByMatchDay,    matchDayId) =>

      matchesByMatchDay[matchDayId].map(matchId => matches[matchId])
  )

export const makeGetSquad = (getSquadName: StringSelector) =>
  createSelector(
    [getSquads, getSquadName],
    (   squads,    squadName) => {

      for (var i in squads) {
        if (squads[i] && squads[i].name == squadName) {
          return squads[i]
        }
      }
      return null
    }
  )

export const makeGetTournamentId =
    (getMatchDay: ModelSelector<m.MatchDay>) =>
  createSelector(
    [getMatchDay],
    (   matchDay) => matchDay.tournamentId
  )

export const makeGetMatchDayBetBucket = (
  getMatchDay: ModelSelector<m.MatchDay>, getPool: ModelSelector<m.Pool>
) =>
  createSelector(
    [getMatchDay, getPool, getBetsByMatchDayAndPool, getBets],
    (   matchDay,    pool,    betsByMatchDayAndPool,    bets) => {
      let betBucketId = betsByMatchDayAndPool[joinKeys(matchDay.id, pool.id)]
      if (!betBucketId) return null
      return bets[betBucketId]
  })

const missingBetForUser = (user: m.User) =>
    m.Bet.create({ userId: user.id, status: m.BetStatus.MISSING })

export const makeGetBetsByMatch = (
  getParticipants: ModelSelector<m.User[]>,
  getMatches: ModelSelector<m.Match[]>,
  getMatchDayBetBucket: ModelSelector<m.MatchDayBetBucket>
) =>
  createSelector(
    [getParticipants, getMatches, getMatchDayBetBucket],
    (   participants,    matches,    matchDayBetBucket) => {
      let betsByMatch: m.IBet[][] = []
      matchDayBetBucket.bets.forEach(matchBetBucket => {
        let matchBetsByUserId: m.IBet[] = []
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
