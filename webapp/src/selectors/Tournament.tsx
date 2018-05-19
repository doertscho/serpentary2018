import { createSelector } from 'reselect'

import { StoreState } from '../types'
import {
  getTournaments,
  getMatchDays,
  getMatchDaysByTournament,
  getUsers,
  getSquads
} from './data'
import { getUserName } from './session'
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
    [getUserName, getUsers, getSquads, getTournamentId],
    (   userName,    users,    squads,    tournamentId) => {
      if (!userName || !userName.length) return []
      let user = users[userName]
      if (!user || !user.squads) return []
      return user.squads.map(squadName => squads[squadName])
    }
  )
