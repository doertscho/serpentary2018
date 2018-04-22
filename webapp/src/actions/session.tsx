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
import { BaseSessionAction, SessionOperation } from './base'

const config = {
    UserPoolId: conf.COGNITO_USER_POOL_ID,
    ClientId: conf.COGNITO_CLIENT_ID
}
const cognitoUserPool: CognitoUserPool = new CognitoUserPool(config)

var cognitoUser: CognitoUser = null

export function signUp(
    username: string, password: string, nickName?: string, email?: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.SIGN_UP
    dispatch(sessionRequest(operation))

    const attributes = buildAdditionalSignUpAttributes(nickName, email)
    console.log("attempting to sign up user", username, attributes)

    cognitoUserPool.signUp(
        username, password, attributes, null,
        (err, result) => {
          if (err) {
            const errorData = extractSignUpErrorData(err)
            dispatch(sessionError(operation, errorData))
            return
          }
          console.log("got result:", result)
          cognitoUser = result.user
          dispatch(sessionResponse(operation))
        }
    )
  }
}

function buildAdditionalSignUpAttributes(nickName?: string, email?: string) {
  const attributes = []
  if (nickName && nickName.length > 0)
    attributes.push(
        new CognitoUserAttribute({ Name: 'nickname', Value: nickName }))
  if (email && email.length > 0)
    attributes.push(
        new CognitoUserAttribute({ Name: 'email', Value: email }))
  return attributes
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

export function logIn(username: string, password: string) {
  return function(dispatch: Dispatch<StoreState>) {

    const operation = constants.LOG_IN
    dispatch(sessionRequest(operation))

    const authenticationDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    })
    cognitoUser = new CognitoUser({
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
        cognitoUser = null
        dispatch(sessionError(operation, err))
      }
    })
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

    console.log("attempting to log out user")

    cognitoUser.signOut()
    // TODO: delete seperately-cached refresh token?
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
}
export function sessionResponse(operation: SessionOperation): SessionResponse {
  return {
    type: constants.SESSION,
    event: constants.RESPONSE,
    operation: operation
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
