import { createSelector, ParametricSelector } from 'reselect'

import { StoreState } from '../types'
import { getMatchDays, getTournaments } from './data'
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
