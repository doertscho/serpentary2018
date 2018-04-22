import * as constants from '../constants'
import { SessionState } from '../types/session'
import { SessionAction } from '../actions'
import { Reducer } from './base'

export const sessionReducer: Reducer<SessionState, SessionAction> =
    (state, action) => {
  switch(action.operation) {
    case constants.SIGN_UP:
      return handleSignUpOrLogInEvent(state, action)
    case constants.LOG_IN:
      return handleSignUpOrLogInEvent(state, action)
    case constants.LOG_OUT:
      return handleLogOutEvent(state, action)
  }
}

const handleSignUpOrLogInEvent: Reducer<SessionState, SessionAction> =
    (state, action) => {
  switch (action.event) {
    case constants.REQUEST:
      console.log("received notice of sign up request", action)
      return { session: copyWith(state, { errorMessage: '' }) }
    case constants.RESPONSE:
      console.log("received sign up response", action)
      return {
        session: copyWith(state, {
          errorMessage: '',
          userId: action.userId,
          loginStatus: constants.LoginStatus.LoggedIn
        })
      }
    case constants.ERROR:
      console.log("received sign up error", action)
      return {
        session: copyWith(state, {
          errorMessage: action.errorMessage,
          userId: '',
          loginStatus: constants.LoginStatus.NotLoggedIn
        })
      }
    default:
      return { }
  }
}

const handleLogOutEvent: Reducer<SessionState, SessionAction> =
    (state, action) => {
  switch (action.event) {
    case constants.RESPONSE:
      console.log("received log out response", action)
      return {
        session: copyWith(state, {
          errorMessage: '',
          userId: '',
          loginStatus: constants.LoginStatus.NotLoggedIn
        })
      }
    default:
      return { }
  }
}

function copyWith(
    state: SessionState, changed: Partial<SessionState>): SessionState {
  return {
    loginStatus: changed.loginStatus || state.loginStatus,
    userId: changed.userId || state.userId,
    errorMessage: changed.errorMessage || state.errorMessage
  }
}
