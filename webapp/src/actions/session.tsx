import { Dispatch } from 'redux'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession
} from 'amazon-cognito-identity-js'

import * as conf from '../../conf/cognito'
import * as constants from '../constants'
import { StoreState } from '../types'
import { InitAction, BaseSessionAction, SessionOperation } from './base'

const config = {
    UserPoolId: conf.COGNITO_USER_POOL_ID,
    ClientId: conf.COGNITO_CLIENT_ID
}
const cognitoUserPool: CognitoUserPool = new CognitoUserPool(config)

var cognitoUser: CognitoUser = cognitoUserPool.getCurrentUser()

export function initSession() {
  return function(dispatch: Dispatch<StoreState>) {
    if (cognitoUser) {
      dispatch(recoverSession())
    } else {
      console.log('Can not recover session from local storage.')
      dispatch(initComplete())
    }
  }
}

function recoverSession() {
  return function(dispatch: Dispatch<StoreState>) {
    cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
      if (err) {
        console.log('Session recovery failed.', err)
        dispatch(initComplete())
        return
      }
      console.log('Received session from local recovery.', session)
      let accessToken =
          session.getAccessToken() || { decodePayload: () => null }
      let payload = accessToken.decodePayload() || {}
      dispatch(sessionResponse(constants.LOG_IN, payload.username))
      dispatch(fetchAttributes())
      // Attributes are not mandatory, signal initialisation completion now.
      dispatch(initComplete())
    })
  }
}

function fetchAttributes() {
  return function(dispatch: Dispatch<StoreState>) {
    cognitoUser.getUserAttributes((err: Error, result) => {
      if (err) {
        console.log('Failed to fetch attributes.', err)
        return
      }
      if (!result || result.length == 0 || !result.forEach) {
        console.log('Received an empty set of user attributes.')
        return
      }
      console.log('User attributes received.', result)
      result.forEach(entry => {
        if (entry.getName() == 'preferred_username')
          dispatch(sessionResponse(constants.LOG_IN, null, entry.getValue()))
      })
    })
  }
}

function initComplete(): InitAction {
  return { type: constants.INIT }
}

export function signUp(userId: string, password: string, email?: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.SIGN_UP
    dispatch(sessionRequest(operation))

    const attributes = []
    if (email && email.length > 0)
      attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }))
    console.log('attempting to sign up user', userId, attributes)

    cognitoUserPool.signUp(
        userId, password, attributes, null,
        (err?: Error, result?) => {
          if (err) {
            const errorData = extractSignUpErrorData(err)
            dispatch(sessionError(operation, errorData))
            return
          }
          console.log('got result:', result)
          cognitoUser = result.user
          dispatch(sessionResponse(operation, userId))
        }
    )
  }
}

function extractSignUpErrorData(err: any): SessionErrorData {
  console.log('got sign up error:', err)
  var message = 'Sign up has failed.'
  if (err.code) {
    if (err.code == 'InvalidParameterException')
      message = 'Password does not satisfy the minimum requirements.'
    else if (err.code == 'UsernameExistsException')
      message = 'That user ID is already in use.'
  }
  return {
    message: message,
    rawError: err
  }
}

export function logIn(userId: string, password: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.LOG_IN
    dispatch(sessionRequest(operation))

    const authenticationDetails = new AuthenticationDetails({
      Username: userId,
      Password: password
    })
    cognitoUser = new CognitoUser({
      Username: userId,
      Pool: cognitoUserPool
    })

    console.log('attempting to log in user', userId)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('got result:', result)
        console.log('cognito user:', cognitoUser)
        dispatch(sessionResponse(operation, userId))
      },
      onFailure: (err: Error) => {
        const errorData = extractLogInErrorData(err)
        cognitoUser = null
        dispatch(sessionError(operation, errorData))
      }
    })
  }
}

function extractLogInErrorData(err: any): SessionErrorData {
  console.log('got log in error:', err)
  var message = 'Log in has failed.'
  if (err.code) {
    if (err.code == 'NotAuthorizedException')
      message = 'Wrong user ID or password.'
  }
  return {
    message: message,
    rawError: err
  }
}

export function logOut() {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.LOG_OUT
    dispatch(sessionRequest(operation))

    if (!cognitoUser) {
      dispatch(sessionResponse(operation))
      return
    }

    console.log('attempting to log out user')

    cognitoUser.signOut()
    cognitoUser = null
    dispatch(sessionResponse(operation))
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

interface SessionErrorData {
  message?: string
  rawError?: any
}
export interface SessionError extends BaseSessionAction {
  event: constants.ERROR
  operation: SessionOperation
  errorMessage?: string
  rawError?: any
}
export function sessionError(
    operation: SessionOperation, data: SessionErrorData): SessionError {
  return {
    type: constants.SESSION,
    event: constants.ERROR,
    operation: operation,
    errorMessage: data.message,
    rawError: data.rawError
  }
}
