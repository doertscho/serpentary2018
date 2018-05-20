import * as constants from '../constants'
import { SessionState } from '../types/session'
import { SessionAction } from '../actions'
import { Reducer } from './base'

export const sessionReducer: Reducer<SessionState, SessionAction> =
    (state, action) => {
  switch(action.operation) {
    case constants.SIGN_UP:
      return handleSignUpEvent(state, action)
    case constants.LOG_IN:
      return handleLogInEvent(state, action)
    case constants.LOG_OUT:
      return handleLogOutEvent(state, action)
    case constants.SET_LOCALE:
      return { session: copyWith(state, { locale: (action as any).locale }) }
    default:
      return { }
  }
}

const handleSignUpEvent: Reducer<SessionState, SessionAction> =
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
          userId: '',
          unconfirmedUserId: action.userId
        })
      }
    case constants.ERROR:
      console.log("received sign up error", action)
      return {
        session: copyWith(state, {
          errorMessage: action.errorMessage,
          userId: ''
        })
      }
    default:
      return { }
  }
}

const handleLogInEvent: Reducer<SessionState, SessionAction> =
    (state, action) => {
  switch (action.event) {
    case constants.REQUEST:
      console.log("received notice of log in request", action)
      return { session: copyWith(state, { errorMessage: '' }) }
    case constants.RESPONSE:
      console.log("received log in response", action)
      return {
        session: copyWith(state, {
          errorMessage: '',
          userId: action.userId,
          unconfirmedUserId: ''
        })
      }
    case constants.ERROR:
      console.log("received log in error", action)
      return {
        session: copyWith(state, {
          errorMessage: action.errorMessage,
          userId: ''
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
          userId: ''
        })
      }
    default:
      return { }
  }
}

function copyWith(
    state: SessionState, changed: Partial<SessionState>): SessionState {
  return {
    userId: changed.userId || state.userId,
    errorMessage: changed.errorMessage || state.errorMessage,
    locale: changed.locale || state.locale,
  }
}
