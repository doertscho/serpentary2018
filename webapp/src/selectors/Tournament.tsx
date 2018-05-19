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
import { NumberSelector } from './util'

export const makeGetTournament = (getTournamentId: NumberSelector) =>
  (state: StoreState, props?: any) =>
    getTournaments(state)[getTournamentId(state, props)]

export const makeGetMatchDays = (getTournamentId: NumberSelector) =>
  createSelector(
    [getMatchDays, getMatchDaysByTournament, getTournamentId],
    (   matchDays,    matchDaysByTournament,    tournamentId) => {
      let matchDayIds = matchDaysByTournament[tournamentId]
      if (!matchDayIds) return []
      return matchDayIds.map(id => matchDays[id])
    }
  )

export const makeGetUserSquadsByTournament =
    (getTournamentId: NumberSelector) =>
  createSelector(
    [getUserId, getUsers, getSquads, getTournamentId],
    (   userId,    users,    squads,    tournamentId) => {
      if (!userId || !userId.length) return []
      let user = users[userId]
      if (!user || !user.squads) return []
      return user.squads.map(squadId => squads[squadId])
    }
  )
