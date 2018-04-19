import { Dispatch } from 'redux'
import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser
} from 'amazon-cognito-identity-js'

import * as conf from '../../conf/cognito'
import * as constants from '../constants'
import { StoreState } from '../types'
import { SessionAction } from './base'

const config = {
    UserPoolId: conf.COGNITO_USER_POOL_ID,
    ClientId: conf.COGNITO_CLIENT_ID
}
const cognitoUserPool = new CognitoUserPool(config)

export function signUp(username: string, password: string, email?: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = 'signUp'
    dispatch(sessionRequest(operation))

    const attributes = []
    if (email && email.length > 0)
      attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }))

    console.log("attempting to sign up user", username, email)

    cognitoUserPool.signUp(
        username, password, attributes, null,
        (err, result) => {
          if (err) {
            console.log("got error:", err)
            dispatch(sessionError(operation, err))
            return
          }
          console.log("got result:", result)
          dispatch(sessionResponse(operation))
        }
    )
  }
}

export function logIn(username: string, password: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = 'logIn'
    dispatch(sessionRequest(operation))

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    })
    const cognitoUser = new CognitoUser({
      Username: username,
      Pool: cognitoUserPool
    })

    console.log("attempting to log in user", username)

    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log("got result:", result)
        dispatch(sessionResponse(operation))
      },
      onFailure: (err) => {
        console.log("got error:", err)
        dispatch(sessionError(operation, err))
      }
    })
  }
}

export interface SessionRequest extends SessionAction {
  event: constants.REQUEST
  operation: string
}
export function sessionRequest(operation: string): SessionRequest {
  return {
    type: constants.SESSION,
    event: constants.REQUEST,
    operation: operation
  }
}

export interface SessionResponse extends SessionAction {
  event: constants.RESPONSE
  operation: string
}
export function sessionResponse(operation: string): SessionResponse {
  return {
    type: constants.SESSION,
    event: constants.RESPONSE,
    operation: operation
  }
}

export interface SessionError extends SessionAction {
  event: constants.ERROR
  operation: string
  error: any
}
export function sessionError(operation: string, error: any): SessionError {
  return {
    type: constants.SESSION,
    event: constants.ERROR,
    operation: operation,
    error: error
  }
}
