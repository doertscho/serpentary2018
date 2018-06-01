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
    [getPool, getUsers],
    (   pool,    users) => {
      if (!pool || !pool.participants) return []
      return pool.participants.map(userId => {
        let user = users[userId]
        if (!user) user = m.User.create({ id: userId })
        return user
      })
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
