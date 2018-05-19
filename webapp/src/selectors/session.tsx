import { createSelector } from 'reselect'

import { StoreState } from '../types'
import { getLocaliser as localesGetLocaliser } from '../locales'
import { getSession } from './index'

export const getLoginStatus =
    (state: StoreState) => getSession(state).loginStatus
export const getUserName =
    (state: StoreState) => getSession(state).userName
export const getSessionErrorMessage =
    (state: StoreState) => getSession(state).errorMessage

export const getLocale =
    (state: StoreState) => getSession(state).locale
