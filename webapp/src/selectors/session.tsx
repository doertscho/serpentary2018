import { createSelector } from 'reselect'

import { StoreState } from '../types'
import { getLocaliser as localesGetLocaliser } from '../locales'
import { getSession } from './index'

export const getLoginStatus =
    (state: StoreState) => getSession(state).loginStatus
export const getUserId =
    (state: StoreState) => getSession(state).userId
export const getSessionErrorMessage =
    (state: StoreState) => getSession(state).errorMessage

export const getLocale =
    (state: StoreState) => getSession(state).locale
