import { StoreState } from '../types'
import { getSession } from './index'

export const getLoginStatus =
    (state: StoreState) => getSession(state).loginStatus
export const getUserId =
    (state: StoreState) => getSession(state).userId
export const getSessionErrorMessage =
    (state: StoreState) => getSession(state).errorMessage
