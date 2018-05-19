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

export const makeGetMatchDay = (getMatchDayId: NumberSelector) =>
  createSelector(
    [getMatchDays, getMatchDayId],
    (   matches,      matchDayId) => matches[matchDayId]
  )

export const makeGetMatches = (getMatchDayId: NumberSelector) =>
  createSelector(
    [getMatches, getMatchesByMatchDay, getMatchDayId],
    (   matches,    matchesByMatchDay,    matchDayId) => {
      let matchIds = matchesByMatchDay[matchDayId]
      if (!matchIds) return null
      return matchIds.map(matchId => matches[matchId])
    }
  )

export const makeGetSquad = (getSquadName: StringSelector) =>
  createSelector(
    [getSquads, getSquadName],
    (   squads,    squadName) => squads[squadName]
  )

export const makeGetTournamentId =
    (getMatchDay: ModelSelector<m.MatchDay>) =>
  createSelector(
    [getMatchDay],
    (   matchDay) => {
      if (!matchDay) return null
      return matchDay.tournamentId
    }
  )

export const makeGetMatchDayBetBucket = (
  getMatchDay: ModelSelector<m.MatchDay>, getSquad: ModelSelector<m.Squad>
) =>
  createSelector(
    [getMatchDay, getSquad, getBets],
    (   matchDay,    squad,    bets) => bets[joinKeys(squad.name, matchDay.id)]
  )

const missingBetForUser = (user: m.User) =>
    m.Bet.create({ userName: user.name, status: m.BetStatus.MISSING })

export const makeGetBetsByMatch = (
  getParticipants: ModelSelector<m.User[]>,
  getMatches: ModelSelector<m.Match[]>,
  getMatchDayBetBucket: ModelSelector<m.MatchDayBetBucket>
) =>
  createSelector(
    [getParticipants, getMatches, getMatchDayBetBucket],
    (   participants,    matches,    matchDayBetBucket) => {
      var betsInBucket: m.IMatchBetBucket[] = []
      if (matchDayBetBucket && matchDayBetBucket.bets)
        betsInBucket = matchDayBetBucket.bets
      let betsByMatch: m.IBet[][] = []
      betsInBucket.forEach(matchBetBucket => {
        let matchBetsByUserName: Map<m.IBet> = {}
        matchBetBucket.bets.forEach(bet => {
          matchBetsByUserName[bet.userName] = bet
        })
        let matchBets = participants.map(user =>
          matchBetsByUserName[user.name] || missingBetForUser(user))
        betsByMatch[matchBetBucket.matchId] = matchBets
      })
      matches.forEach(match => {
        if (!betsByMatch[match.id])
          betsByMatch[match.id] = participants.map(missingBetForUser)
      })
      return betsByMatch
    }
  )
