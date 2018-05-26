import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import { getUsers, getPools, getPoolsBySquad } from './data'
import { ModelSelector, StringSelector } from './util'

export const makeGetPool = (
    getSquadId: StringSelector, getTournamentId: StringSelector
) =>
  createSelector(
    [getSquadId, getTournamentId, getPools],
    (   squadId,    tournamentId,    pools) => {
      console.log("pools:", pools)
      return pools[joinKeys(squadId, tournamentId)]
    }
  )

export const makeGetParticipants = (getPool: ModelSelector<m.Pool>) =>
  createSelector(
    [getPool, getUsers],
    (   pool,    users) => {
      console.log("pool:", pool)
      if (!pool || !pool.participants) return []
      return pool.participants.map(userId => users[userId])
    }
  )
