import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
  CognitoUserSession,
  ICognitoUserAttributeData
} from 'amazon-cognito-identity-js'

import * as conf from '../../conf/cognito'
import { SessionManager } from './base'

const config = {
    UserPoolId: conf.COGNITO_USER_POOL_ID,
    ClientId: conf.COGNITO_CLIENT_ID
}

export default class CognitoSessionManager implements SessionManager {

  cognitoUserPool: CognitoUserPool = new CognitoUserPool(config)

  cognitoUser: CognitoUser = this.cognitoUserPool.getCurrentUser()
  cognitoSession: CognitoUserSession = null

  canRecoverSessionFromCache() {
    return !!this.cognitoUser
  }

  getHeadersForAuthorisedRequest() {
    if (!this.cognitoSession || !this.cognitoSession.getIdToken()) return {}
    return { Authorization: this.cognitoSession.getIdToken().getJwtToken() }
  }

  retrieveSession(
    onSuccess: (userName: string, isAdmin: boolean) => void,
    onError?: () => void
  ) {
    console.log('Trying to retrieve session from local storage.')
    if (!this.cognitoUser) {
      if (onError) onError()
      return
    }
    let self = this
    this.cognitoUser.getSession((err: Error, session: CognitoUserSession) => {
      if (err) {
        console.log('Session recovery failed.', err)
        if (onError) onError()
        return
      }
      self.updateSession(session, onSuccess, onError)
    })
  }

  refreshSession(
    onSuccess: (userName: string, isAdmin: boolean) => void,
    onError?: () => void
  ) {
    console.log('Trying to refresh session.')
    if (!this.cognitoUser || !this.cognitoSession) {
      if (onError) onError()
      return
    }
    let refreshToken = this.cognitoSession.getRefreshToken()
    if (!refreshToken) {
      if (onError) onError()
      return
    }
    let self = this
    this.cognitoUser.refreshSession(
      refreshToken,
      (err: Error, session: CognitoUserSession) => {
        if (err) {
          console.log('Session recovery failed.', err)
          if (onError) onError()
          return
        }
        self.updateSession(session, onSuccess, onError)
      })
  }

  updateSession(
    newSession: CognitoUserSession,
    onSuccess: (userName: string, isAdmin: boolean) => void,
    onError?: () => void
  ) {
    console.log('Received session:', newSession)
    this.cognitoSession = newSession
    let accessToken =
        newSession.getAccessToken() || { decodePayload: () => null }
    let payload = accessToken.decodePayload() || {}
    let userName = payload.username
    if (!userName) {
      if (onError) onError()
      return
    }
    onSuccess(userName, this.isAdmin())
  }

  retrieveUserAttributes(
    onSuccess: (attributes: { [key: string]: string }) => void,
    onError?: () => void
  ) {

    if (!this.cognitoUser) {
      if (onError) onError()
      return
    }

    this.cognitoUser.getUserAttributes((err: Error, result) => {

      if (err) {
        console.log('Failed to fetch attributes.', err)
        if (onError) onError()
        return
      }
      if (!result || result.length == 0 || !result.forEach) {
        console.log('Received an empty set of user attributes.')
        if (onError) onError()
        return
      }

      console.log('User attributes received.', result)
      let attributes: { [key: string]: string } = {}
      result.forEach(entry => {
        attributes[entry.getName()] = entry.getValue()
      })
      onSuccess(attributes)
    })
  }

  isAdmin() {
    let s = this.cognitoSession
    if (!s) return false
    let t = s.getIdToken()
    if (!t) return false
    let p = t.decodePayload()
    return p &&
      p['cognito:groups'] &&
      p['cognito:groups'].length &&
      p['cognito:groups'][0] == 'admins'
  }

  signUpUser(
    userName: string,
    password: string,
    email?: string,
    onSuccess?: () => void,
    onError?: (errorMessage?: string) => void
  ) {

    let attributes = []
    if (email && email.length > 0)
      attributes.push(new CognitoUserAttribute({ Name: 'email', Value: email }))

    let self = this
    this.cognitoUserPool.signUp(
      userName, password, attributes, null,
      (err?: Error, result?) => {
        if (err) {
          if (onError) onError(extractSignUpErrorData(err))
          return
        }
        console.log('sign up successful!', result)
        self.cognitoUser = result.user
        if (onSuccess) onSuccess()
      }
    )
  }

  logInUser(
    userName: string,
    password: string,
    onSuccess: (isAdmin: boolean) => void,
    onError: (errorMessage?: string) => void
  ) {

    let authenticationDetails = new AuthenticationDetails({
      Username: userName,
      Password: password
    })
    this.cognitoUser = new CognitoUser({
      Username: userName,
      Pool: this.cognitoUserPool
    })

    console.log('attempting to log in user', userName)

    let self = this
    this.cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        console.log('got result:', result)
        onSuccess(this.isAdmin())
      },
      onFailure: (err: Error) => {
        self.cognitoUser = null
        onError(extractLogInErrorData(err))
      }
    })
  }

  logOutUser(onSuccess: () => void, onError: (errorMessage?: string) => void) {

    if (!this.cognitoUser) {
      onSuccess()
      return
    }

    console.log('attempting to log out user')
    this.cognitoUser.signOut()
    this.cognitoUser = null
    this.cognitoSession = null
    onSuccess()
  }

  updatePreferredName(
    newName: string,
    onSuccess: () => void,
    onError: () => void
  ) {

    if (!this.cognitoUser) {
      onError()
      return
    }

    let data = { Name: 'preferred_username', Value: newName }
    let attributes = [data]

    this.cognitoUser.updateAttributes(attributes, (err?, result?) => {
      if (err) {
        console.log('error updating preferred name:', err)
        if (onError) onError()
        return
      }
      console.log('updated preferred name:', result)
      onSuccess()
    })
  }
}

function extractSignUpErrorData(err: any): string {
  var message = 'Sign up has failed.'
  if (err.code) {
    if (err.code == 'InvalidParameterException')
      message = 'Password does not satisfy the minimum requirements.'
    else if (err.code == 'UsernameExistsException')
      message = 'That user ID is already in use.'
  }
  return message
}

function extractLogInErrorData(err: any): string {
  var message = 'Log in has failed.'
  if (err.code) {
    if (err.code == 'NotAuthorizedException')
      message = 'Wrong user ID or password.'
  }
  return message
}
