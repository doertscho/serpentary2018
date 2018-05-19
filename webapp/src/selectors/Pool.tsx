import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import { getUsers, getPools, getPoolsBySquad } from './data'
import { ModelSelector } from './util'

export const makeGetPool = (
    getMatchDay: ModelSelector<m.MatchDay>, getSquad: ModelSelector<m.Squad>
) =>
  createSelector(
    [getMatchDay, getSquad, getPools],
    (   matchDay,    squad,    pools) =>
      pools[joinKeys(squad.id, matchDay.tournamentId)]
  )

export const makeGetParticipants = (getPool: ModelSelector<m.Pool>) =>
  createSelector(
    [getPool, getUsers],
    (   pool,    users) => pool.participants.map(userId => users[userId])
  )
