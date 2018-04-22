import { StoreState } from '../types'
import { getSession } from './index'

export const isLoggedIn =
    (state: StoreState) => getSession(state).isLoggedIn
export const getUserId =
    (state: StoreState) => getSession(state).userId
export const getSessionErrorMessage =
    (state: StoreState) => getSession(state).errorMessage
