import { createSelector } from 'reselect'

import { StoreState } from '../types'
import {
  getTournaments,
  getMatchDays,
  getMatchDaysByTournament,
  getUsers,
  getSquads
} from './data'
import { getUserId } from './session'
import { StringSelector } from './util'

export const makeGetTournament = (getTournamentId: StringSelector) =>
  (state: StoreState, props?: any) =>
    getTournaments(state)[getTournamentId(state, props)]

export const makeGetMatchDays = (getTournamentId: StringSelector) =>
  createSelector(
    [getMatchDays, getMatchDaysByTournament, getTournamentId],
    (   matchDays,    matchDaysByTournament,    tournamentId) => {
      let matchDayIds = matchDaysByTournament[tournamentId]
      if (!matchDayIds) return []
      return matchDayIds.map(id => matchDays[id])
    }
  )

export const makeGetUserSquadsByTournament =
    (getTournamentId: StringSelector) =>
  createSelector(
    [getUserId, getUsers, getTournamentId],
    (   userId,    users,    tournamentId) => {
      console.log("extracting pools", userId, tournamentId, users)
      if (!userId || !userId.length) return []
      let user = users[userId]
      if (!user || !user.pools) return []
      console.log("checking user pools: " + user.pools)
      let squadIds = []
      for (let i = 0; i < user.pools.length; i++) {
        let poolId = user.pools[i]
        let pos = poolId.indexOf('/' + tournamentId)
        console.log("pos in ", poolId, pos)
        if (pos !== -1) {
          let squadId = poolId.substring(0, pos)
          squadIds.push(squadId)
        }
      }
      return squadIds
    }
  )
