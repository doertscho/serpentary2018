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
      return {
        errorMessage: null,
        session: copyWith(state, { errorMessage: null })
      }
    case constants.RESPONSE:
      return {
        errorMessage: null,
        session: copyWith(state, {
          errorMessage: null,
          userId: null,
          unconfirmedUserId: action.userId
        })
      }
    case constants.ERROR:
      return {
        errorMessage: action.errorMessage,
        session: copyWith(state, {
          errorMessage: action.errorMessage,
          userId: null
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
      return {
        errorMessage: null,
        session: copyWith(state, { errorMessage: null })
      }
    case constants.RESPONSE:
      return {
        errorMessage: null,
        session: copyWith(state, {
          errorMessage: null,
          userId: action.userId,
          unconfirmedUserId: null,
          preferredUserName: action.preferredUserName,
        })
      }
    case constants.ERROR:
      return {
        errorMessage: action.errorMessage,
        session: copyWith(state, {
          errorMessage: action.errorMessage,
          userId: null
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
      return {
        errorMessage: null,
        session: copyWith(state, {
          userId: null,
          errorMessage: null,
          preferredUserName: null
        })
      }
    default:
      return { }
  }
}

function copyWith(
    s: SessionState, c: Partial<SessionState>): SessionState {
  return {
    userId: c.userId === undefined ?
        s.userId : c.userId,
    unconfirmedUserId: c.unconfirmedUserId === undefined ?
        s.unconfirmedUserId : c.unconfirmedUserId,
    preferredUserName: c.preferredUserName === undefined ?
        s.preferredUserName : c.preferredUserName,
    errorMessage: c.errorMessage === undefined ?
        s.errorMessage : c.errorMessage,
    locale: c.locale === undefined ?
        s.locale : c.locale,
  }
}
