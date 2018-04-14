import { createSelector, ParametricSelector } from 'reselect'

import { StoreState } from '../types'
import { getMatchDays } from './index'
import { NumberSelector } from './util'

export const makeGetTournament = (getTournamentId: NumberSelector) =>
  (store: StoreState, props?: any) =>
    store.tournaments[getTournamentId(store, props)]

export const makeGetMatchDays = (getTournamentId: NumberSelector) =>
  createSelector(
    [getMatchDays, getTournamentId],
    (   matchDays,    tournamentId) =>
      matchDays.filter(matchDay => matchDay.tournamentId == tournamentId)
  )
