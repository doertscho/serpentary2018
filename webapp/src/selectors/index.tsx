import { createSelector } from 'reselect'

import { StoreState } from '../types'

export const isInitialised = (state: StoreState) => state.isInitialised
export const getPendingRequests = (state: StoreState) => state.pendingRequests
export const getData = (state: StoreState) => state.data
export const getSession = (state: StoreState) => state.session
export const getUi = (state: StoreState) => state.ui

export const hasPendingRequests =
  createSelector(
    [getPendingRequests],
    (   pendingRequests) => pendingRequests.length > 0
  )
