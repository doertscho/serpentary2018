import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import {
  getUsers,
  getPools,
  getPoolsBySquad,
  getExtraQuestionBets
} from './data'
import { getUserId } from './session'
import { ModelSelector, StringSelector } from './util'

export const makeGetPool = (
    getSquadId: StringSelector, getTournamentId: StringSelector
) =>
  createSelector(
    [getSquadId, getTournamentId, getPools],
    (   squadId,    tournamentId,    pools) => {
      return pools[joinKeys(squadId, tournamentId)]
    }
  )

export const makeGetParticipants = (getPool: ModelSelector<m.Pool>) =>
  createSelector(
    [getPool, getUserId, getUsers],
    (   pool,    userId,    users) => {
      if (!pool || !pool.participants) return []
      let me: m.User[] = []
      let rest: m.User[] = []
      pool.participants.forEach(participantId => {
        let user = users[participantId]
        if (!user) user = m.User.create({ id: participantId })
        if (participantId == userId) me.push(user)
        else rest.push(user)
      })
      return me.concat(rest)
    }
  )

export const makeGetPoolsBySquad = (
    getSquadId: StringSelector
) =>
  createSelector(
    [getSquadId, getPoolsBySquad, getPools],
    (   squadId,    poolsBySquad,    pools) => {
      if (!poolsBySquad || !poolsBySquad[squadId]) return []
      return poolsBySquad[squadId].map(poolId => pools[poolId])
    }
  )

export const makeGetExtraQuestionBetBucket = (
    getSquadId: StringSelector, getTournamentId: StringSelector
) =>
  createSelector(
    [getSquadId, getTournamentId, getExtraQuestionBets],
    (   squadId,    tournamentId,    extraQuestionBets) => {
      return extraQuestionBets[joinKeys(squadId, tournamentId)]
    }
  )
