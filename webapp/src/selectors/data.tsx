import { StoreState } from '../types'
import { getData } from './index'

export const getTournaments = (state: StoreState) => getData(state).tournaments
export const getMatchDays = (state: StoreState) => getData(state).matchDays
export const getMatchDaysByTournament =
    (state: StoreState) => getData(state).matchDaysByTournament
export const getMatches = (state: StoreState) => getData(state).matches
export const getMatchesByMatchDay =
    (state: StoreState) => getData(state).matchesByMatchDay
export const getUsers = (state: StoreState) => getData(state).users
export const getSquads = (state: StoreState) => getData(state).squads
export const getPools = (state: StoreState) => getData(state).pools
export const getPoolsByTournament =
    (state: StoreState) => getData(state).poolsByTournament
export const getPoolsBySquad =
    (state: StoreState) => getData(state).poolsBySquad
export const getBets = (state: StoreState) => getData(state).bets
