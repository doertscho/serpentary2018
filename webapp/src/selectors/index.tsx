import { createSelector } from 'reselect'

import { StoreState } from '../types'

export const isInitialised = (state: StoreState) => state.isInitialised
export const getData = (state: StoreState) => state.data
export const getSession = (state: StoreState) => state.session
