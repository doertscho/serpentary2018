import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { getUsers, getPools, getPoolsBySquad } from './data'
import { ModelSelector } from './util'

export const makeGetPool = (
    getMatchDay: ModelSelector<m.MatchDay>, getSquad: ModelSelector<m.Squad>
) =>
  createSelector(
    [getMatchDay, getSquad, getPools, getPoolsBySquad],
    (   matchDay,    squad,    pools,    poolsBySquad) => {
      let squadPoolIds = poolsBySquad[squad.id]
      if (!squadPoolIds) return null
      let squadPools = squadPoolIds.map(poolId => pools[poolId])
      for (var i in squadPools) {
        if (squadPools[i].tournamentId == matchDay.tournamentId)
          return squadPools[i]
      }
      return null
    }
  )

export const makeGetParticipants = (getPool: ModelSelector<m.Pool>) =>
  createSelector(
    [getPool, getUsers],
    (   pool,    users) => pool.participants.map(userId => users[userId])
  )
