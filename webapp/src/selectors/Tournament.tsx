import { createSelector } from 'reselect'

import { StoreState } from '../types'
import {
  getTournaments,
  getMatchDays,
  getMatchDaysByTournament,
  getPools,
  getPoolsBySquad,
  getSquads
} from './data'
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
    [getPools, getPoolsBySquad, getSquads, getTournamentId],
    (   pools,    poolsBySquad,    squads,    tournamentId) => {
      // TODO: for now, just select all squads
      return squads
    }
  )
