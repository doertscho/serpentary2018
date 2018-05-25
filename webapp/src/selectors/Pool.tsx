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
    (   squadId,    tournamentId,    pools) =>
      pools[joinKeys(squadId, tournamentId)]
  )

export const makeGetParticipants = (getPool: ModelSelector<m.Pool>) =>
  createSelector(
    [getPool, getUsers],
    (   pool,    users) => pool.participants.map(userId => users[userId])
  )
