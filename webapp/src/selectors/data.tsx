import { StoreState } from '../types'
import { getData } from './index'

export const getTournaments = (state: StoreState) => getData(state).tournaments
export const getMatchDays = (state: StoreState) => getData(state).matchDays
export const getMatches = (state: StoreState) => getData(state).matches
