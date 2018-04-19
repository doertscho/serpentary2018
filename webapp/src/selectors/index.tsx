import { createSelector } from 'reselect'

import { StoreState } from '../types'

export const getData = (state: StoreState) => state.data
export const getSession = (state: StoreState) => state.session
