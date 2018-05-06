import { createSelector } from 'reselect'

import { StoreState } from '../types'
import {
  getMatchDays,
  getTournaments,
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
    [getMatchDays, getTournamentId],
    (   matchDays,    tournamentId) =>
      matchDays.filter(matchDay => matchDay.tournamentId == tournamentId)
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
