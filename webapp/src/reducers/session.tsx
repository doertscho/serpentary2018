import * as constants from '../constants'
import { DataState } from '../types/data'
import { SessionState } from '../types/session'
import { SessionAction } from '../actions'
import { Reducer } from './base'

export const sessionReducer: Reducer<SessionAction> = (state, action) => {
  switch(action.operation) {
    case constants.SIGN_UP:
      return handleSignUpEvent(state, action)
    case constants.LOG_IN:
      return handleLogInEvent(state, action)
    case constants.LOG_OUT:
      return handleLogOutEvent(state, action)
    case constants.SET_LOCALE:
      return {
        session: copyWith(state.session, {
          locale: (action as any).locale
        })
      }
    case constants.SET_CURRENT_SQUAD:
      return {
        session: copyWith(state.session, {
          currentSquadId: (action as any).currentSquadId
        })
      }
    case constants.USER_DATA_RECEIVED:
      return {
        session: copyWith(state.session, {
          currentSquadId: getNewCurrentSquadId(state.session, state.data)
        })
      }
  }
  return { }
}

const handleSignUpEvent: Reducer<SessionAction> = (state, action) => {
  switch (action.event) {
    case constants.REQUEST:
      return {
        errorMessage: null,
        session: copyWith(state.session, { errorMessage: null })
      }
    case constants.RESPONSE:
      return {
        errorMessage: null,
        session: copyWith(state.session, {
          errorMessage: null,
          userId: null,
          unconfirmedUserId: action.userId
        })
      }
    case constants.ERROR:
      return {
        errorMessage: action.errorMessage,
        session: copyWith(state.session, {
          errorMessage: action.errorMessage,
          userId: null
        })
      }
    default:
      return { }
  }
}

const handleLogInEvent: Reducer<SessionAction> = (state, action) => {
  switch (action.event) {
    case constants.REQUEST:
      return {
        errorMessage: null,
        session: copyWith(state.session, { errorMessage: null })
      }
    case constants.RESPONSE:
      return {
        errorMessage: null,
        session: copyWith(state.session, {
          errorMessage: null,
          userId: action.userId,
          unconfirmedUserId: null,
          preferredUserName: action.preferredUserName,
        })
      }
    case constants.ERROR:
      return {
        errorMessage: action.errorMessage,
        session: copyWith(state.session, {
          errorMessage: action.errorMessage,
          userId: null
        })
      }
    default:
      return { }
  }
}

const handleLogOutEvent: Reducer<SessionAction> = (state, action) => {
  switch (action.event) {
    case constants.RESPONSE:
      return {
        errorMessage: null,
        session: copyWith(state.session, {
          userId: null,
          errorMessage: null,
          preferredUserName: null
        })
      }
    default:
      return { }
  }
}

const getNewCurrentSquadId = (s: SessionState, d: DataState) => {

  let currentSquadId = s.currentSquadId
  let userId = s.userId
  let users = d.users
  if (!userId || !users)
    return currentSquadId

  let user = users[userId]
  if (!user || !user.squads || !user.squads.length)
    return currentSquadId

  if (currentSquadId && user.squads.indexOf(currentSquadId) !== -1)
    return currentSquadId

  let newCurrentSquadId = user.squads[0]

  // yes, this should not happen in a reducer. it's a bypass for until the state
  // as a whole is persisted in the local storage.
  let storage = window.localStorage
  if (storage) storage.setItem('currentSquad', newCurrentSquadId)

  return newCurrentSquadId
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
    currentSquadId: c.currentSquadId === undefined ?
        s.currentSquadId : c.currentSquadId,
  }
}
