import { createSelector } from 'reselect'
import { StoreState } from '../types'

export const getTournamentMap = (state: StoreState) => state.tournaments
export const getMatchDayMap = (state: StoreState) => state.matchDays
export const getMatchMap = (state: StoreState) => state.matches

export const getTournaments = createSelector(
  [getTournamentMap],
  (   tournamentMap) =>
    tournamentMap.valueSeq()
)

export const getMatchDays = createSelector(
  [getMatchDayMap],
  (   matchDayMap) =>
    matchDayMap.valueSeq()
)

export const getMatches = createSelector(
  [getMatchMap],
  (   matchMap) =>
    matchMap.valueSeq()
)
