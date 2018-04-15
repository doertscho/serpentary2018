import { createSelector } from 'reselect'

import { StoreState } from '../types'

export const getTournaments = (state: StoreState) => state.tournaments
export const getMatchDays = (state: StoreState) => state.matchDays
export const getMatches = (state: StoreState) => state.matches
