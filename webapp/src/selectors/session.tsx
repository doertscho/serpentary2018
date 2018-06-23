import { createSelector } from 'reselect'

import { StoreState } from '../types'
import { getSession } from './index'

export const getUserId =
    (state: StoreState) => getSession(state).userId
export const getUnconfirmedUserId =
    (state: StoreState) => getSession(state).unconfirmedUserId
export const getPreferredUserName =
    (state: StoreState) => getSession(state).preferredUserName
export const getIsAdmin =
    (state: StoreState) => getSession(state).isAdmin
export const getSessionErrorMessage =
    (state: StoreState) => getSession(state).errorMessage

export const getLocale =
    (state: StoreState) => getSession(state).locale

export const getCurrentSquadId =
    (state: StoreState) => getSession(state).currentSquadId
