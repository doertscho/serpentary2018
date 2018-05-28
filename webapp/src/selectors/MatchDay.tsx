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
  getPool: ModelSelector<m.Pool>,
  getMatches: ModelSelector<m.Match[]>,
  getMatchDayBetBucket: ModelSelector<m.MatchDayBetBucket>
): ModelSelector<m.Bet[][]> {
  return createSelector(
    [getPool, getMatches, getMatchDayBetBucket],
    (   pool,    matches,    matchDayBetBucket) => {
      if (!pool || !matches || !matchDayBetBucket) return []
      matches = matches || []
      let participantIds: string[] = pool.participants || []
      let userBetBuckets: m.IUserBetBucket[] = []
      if (matchDayBetBucket && matchDayBetBucket.bets)
        userBetBuckets = matchDayBetBucket.bets
      let betsByUser = buildBetsByUserMap(userBetBuckets)
      return buildBetsByMatchMap(betsByUser, matches, participantIds)
    }
  )
}

function buildBetsByUserMap(userBetBuckets: m.IUserBetBucket[]) {
  let betsByUser: Map<m.Bet[]> = {}
  userBetBuckets.forEach(userBetBucket => {
    let userId = userBetBucket.userId
    betsByUser[userId] = []
    let betsSeq: m.IBet[] = userBetBucket.bets || []
    betsSeq.forEach(bet => {
      let betCopy = m.Bet.create(bet)
      betCopy.userId = userId
      betsByUser[userId][bet.matchId] = betCopy
    })
  })
  return betsByUser
}

function buildBetsByMatchMap(
    betsByUser: Map<m.Bet[]>, matches: m.Match[], participantIds: string[]) {

  let betsByMatch: m.Bet[][] = []
  matches.forEach(match => {
    betsByMatch[match.id] = []
    participantIds.forEach(userId => {
      if (betsByUser[userId] && betsByUser[userId][match.id])
        betsByMatch[match.id].push(betsByUser[userId][match.id])
      else
        betsByMatch[match.id].push(createMissingBetForUser(match.id, userId))
    })
  })
  return betsByMatch
}

function createMissingBetForUser(matchId: number, userId: string) {
  return m.Bet.create({
      matchId: matchId, userId: userId, status: m.BetStatus.MISSING })
}
