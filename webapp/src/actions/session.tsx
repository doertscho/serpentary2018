import { Dispatch } from 'redux'

import * as constants from '../constants'
import { models as m } from '../types/models'
import { StoreState } from '../types'
import { supportedLocales } from '../locales'
import { sessionManager } from '../session'
import {
  InitAction,
  BaseSessionAction,
  SessionOperation,
  apiRequest
} from './base'
import { getMe } from './data'

export function initSession() {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(initLocale())
    dispatch(initUser())
  }
}

function initLocale() {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(determineLocale(window.navigator.language || ''))
  }
}

function initUser() {
  return function(dispatch: Dispatch<StoreState>) {
    if (sessionManager.canRecoverSessionFromCache()) {
      dispatch(recoverSession())
      dispatch(getMe())
    } else {
      console.log('Can not recover session from local storage.')
      dispatch(initComplete())
    }
  }
}

function recoverSession() {
  return function(dispatch: Dispatch<StoreState>) {
    sessionManager.retrieveSession(
      (userId: string) => {
        dispatch(sessionResponse(constants.LOG_IN, userId))
        dispatch(fetchAttributes())
        dispatch(getMe())
        // Attributes are not mandatory, signal initialisation completion now.
        dispatch(initComplete())
      },
      () => {
        dispatch(initComplete())
      }
    )
  }
}

function fetchAttributes() {
  return function(dispatch: Dispatch<StoreState>) {
    sessionManager.retrieveUserAttributes(
      (attributes: { [key: string]: string }) => {
        if (attributes.preferred_username)
          dispatch(sessionResponse(
              constants.LOG_IN, null, attributes.preferred_username))
        if (attributes.locale)
          dispatch(determineLocale(attributes.locale))
      }
    )
  }
}

function determineLocale(name: string) {
  return function(dispatch: Dispatch<StoreState>) {
    let lowerName = name.toLowerCase()
    for (var i = 0; i < supportedLocales.length; i++) {
      let locale = supportedLocales[i].toLowerCase();
      if (lowerName.indexOf(locale) !== -1) {
        dispatch(setLocale(locale))
        return
      }
    }
  }
}

function initComplete(): InitAction {
  return { type: constants.INIT }
}

export function signUp(userId: string, password: string, email?: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.SIGN_UP
    dispatch(sessionRequest(operation))

    sessionManager.signUpUser(
      userId, password, email,
      () => {
        dispatch(sessionResponse(operation, userId))
      },
      (errorMessage: string) => {
        dispatch(sessionError(operation, errorMessage))
      }
    )
  }
}

export function logIn(userId: string, password: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.LOG_IN
    dispatch(sessionRequest(operation))

    sessionManager.logInUser(
      userId,
      password,
      () => {
        dispatch(sessionResponse(operation, userId))
      },
      (errorMessage: string) => {
        dispatch(sessionError(operation, errorMessage))
      }
    )
  }
}

export function logOut() {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.LOG_OUT
    dispatch(sessionRequest(operation))

    sessionManager.logOutUser(
      () => {
        dispatch(sessionResponse(operation))
      },
      (errorMessage: string) => {
        dispatch(sessionError(operation, errorMessage))
      }
    )
  }
}

export interface SessionRequest extends BaseSessionAction {
  event: constants.REQUEST
  operation: SessionOperation
}
export function sessionRequest(operation: SessionOperation): SessionRequest {
  return {
    type: constants.SESSION,
    event: constants.REQUEST,
    operation: operation
  }
}

export interface SessionResponse extends BaseSessionAction {
  event: constants.RESPONSE
  operation: SessionOperation
  userId?: string
  preferredUserName?: string
}
export function sessionResponse(
    operation: SessionOperation, userId?: string, preferredUserName?: string
): SessionResponse {
  return {
    type: constants.SESSION,
    event: constants.RESPONSE,
    operation: operation,
    userId: userId,
    preferredUserName: preferredUserName
  }
}

export interface SessionError extends BaseSessionAction {
  event: constants.ERROR
  operation: SessionOperation
  errorMessage?: string
}
export function sessionError(
    operation: SessionOperation, message: string): SessionError {
  return {
    type: constants.SESSION,
    event: constants.ERROR,
    operation: operation,
    errorMessage: message
  }
}

export interface SetLocale extends BaseSessionAction {
  event: constants.REQUEST
  operation: constants.SET_LOCALE
  locale: string
}
export function setLocale(locale: string): SetLocale {
  return {
    type: constants.SESSION,
    event: constants.REQUEST,
    operation: constants.SET_LOCALE,
    locale: locale
  }
}
