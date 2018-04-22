import * as constants from '../constants'
import { SessionState } from '../types/session'
import { SessionAction } from '../actions'
import { Reducer } from './base'

export const sessionReducer: Reducer<SessionState> = (state, action) => {
  switch(action.event) {
    case constants.REQUEST:
      console.log("received notice of session request", action)
      return { session: copyWith(state, { errorMessage: '' }) }
    case constants.RESPONSE:
      console.log("received session response", action)
      return { session: copyWith(state, { errorMessage: '' }) }
    case constants.ERROR:
      console.log("received session error", action)
      return { session: copyWith(state, { errorMessage: action.errorMessage }) }
    default:
      return { }
  }
}

function copyWith(
    state: SessionState, changed: Partial<SessionState>): SessionState {
  return {
    isLoggedIn: changed.isLoggedIn || state.isLoggedIn,
    userId: changed.userId || state.userId,
    errorMessage: changed.errorMessage || state.errorMessage
  }
}
