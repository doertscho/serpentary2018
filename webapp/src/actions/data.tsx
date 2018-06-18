import { Dispatch } from 'redux'
import {
  decode as base64decode,
  encode as base64encode
} from 'base64-arraybuffer'

import * as constants from '../constants'
import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Callbacks, BaseDataAction, apiGet, apiPost } from './base'
import { sessionManager } from '../session'

/*
 * SESSION SYNC
 */

export const getMe = (callbacks?: Callbacks) =>
  fetchData('/me', callbacks, true)

/*
 * DATA FETCHERS
 */

export const fetchTournaments = (callbacks?: Callbacks) =>
  fetchData('/tournaments', callbacks)

export const fetchTournament = (tournamentId: string, callbacks?: Callbacks) =>
  fetchData('/tournaments/' + tournamentId, callbacks)

export const fetchMatchDay = (
  tournamentId: string,
  matchDayId: string,
  callbacks?: Callbacks
) =>
  fetchData(
      '/tournaments/' + tournamentId + '/match-days/' + matchDayId,
      callbacks
  )

export const fetchBetsAsGuest = (
  squadId: string,
  tournamentId: string,
  matchDayId: string,
  callbacks?: Callbacks
) =>
  fetchData(
      '/tournaments/' + tournamentId +
        '/match-days/' + matchDayId +
        '/bets/' + squadId,
      callbacks
  )

export const fetchBetsAsUser = (
  squadId: string,
  tournamentId: string,
  matchDayId: string,
  callbacks?: Callbacks
) =>
  fetchData(
      '/tournaments/' + tournamentId +
        '/match-days/' + matchDayId +
        '/bets/' + squadId + '/mine',
      callbacks,
      true
  )

export const fetchSquad = (squadId: string, callbacks?: Callbacks) =>
  fetchData('/squads/' + squadId, callbacks)

export const fetchPool = (
  squadId: string,
  tournamentId: string,
  callbacks?: Callbacks
) =>
  fetchData(
      '/tournaments/' + tournamentId +
        '/pools/' + squadId,
      callbacks
  )

export const fetchExtraQuestions = (
  squadId: string,
  tournamentId: string,
  callbacks?: Callbacks
) =>
  fetchData(
      '/tournaments/' + tournamentId +
        '/pools/' + squadId +
        '/extra-questions',
      callbacks,
      true
  )

/*
 * POSTING DATA
 */

export const joinSquad = (squadId: string) => postData('/squads/' + squadId)
export const joinPool = (squadId: string, tournamentId: string) =>
    postData('/tournaments/' + tournamentId + '/pools/' + squadId)

export const postBet = (
    squadId: string, tournamentId: string, matchDayId: string,
    bet: m.Bet,
    callbacks?: Callbacks
  ) => postData(
    '/tournaments/' + tournamentId + '/match-days/' + matchDayId +
      '/bets/' + squadId + '/mine',
    callbacks,
    base64encode(m.Bet.encode(bet).finish())
  )
export const postExtraQuestionBets = (
    squadId: string, tournamentId: string,
    betBucket: m.ExtraQuestionUserBetBucket,
    callbacks?: Callbacks
  ) => postData(
    '/tournaments/' + tournamentId + '/pools/' + squadId + '/extra-questions',
    callbacks,
    base64encode(m.ExtraQuestionUserBetBucket.encode(betBucket).finish())
  )

export const postNewPreferredName = (
  newName: string, callbacks?: Callbacks) => {

  console.log("posting preferred name", newName)
  let obj = m.User.create({ preferredName: newName })
  let payload = m.User.encode(obj).finish()
  return postData(
    '/me/preferred-name',
    callbacks,
    base64encode(payload)
  )
}

/*
 * ACTION CREATORS
 */

export interface DataRequest extends BaseDataAction {
  event: constants.REQUEST
  path: string
}
export function dataRequest(path: string): DataRequest {
  return {
    type: constants.DATA,
    event: constants.REQUEST,
    path: path
  }
}

export interface DataResponse extends BaseDataAction {
  event: constants.RESPONSE
  path: string
  data: m.Update
}
export function dataResponse(
    path: string, data: m.Update): DataResponse {
  return {
    type: constants.DATA,
    event: constants.RESPONSE,
    path: path,
    data: data
  }
}

export interface DataError extends BaseDataAction {
  event: constants.ERROR
  path: string
  errorMessage: string
}
export function dataError(path: string, errorMessage: string): DataError {
  return {
    type: constants.DATA,
    event: constants.ERROR,
    path: path,
    errorMessage: errorMessage
  }
}

/*
 * REQUEST HELPERS
 */

function fetchData(
  path: string,
  callbacks?: Callbacks,
  withIdentity?: boolean
) {
   return function(dispatch: Dispatch<StoreState>) {
     dispatch(dataRequest(path))
     return fetch(path, dispatch, callbacks, withIdentity)
  }
}

function postData(
  path: string,
  callbacks?: Callbacks,
  data?: string
) {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(dataRequest(path))
    return post(path, dispatch, callbacks, data)
  }
}

const fetch = (
  path: string,
  dispatch: Dispatch<StoreState>,
  callbacks?: Callbacks,
  withIdentity?: boolean,
  retries?: number
) => {
  if (retries === undefined) retries = 1
  apiGet(path, withIdentity)
    .then(response => handleResponse(response, path, dispatch, callbacks))
    .catch(error =>
      handleError(
        error, path, dispatch, callbacks, retries,
        (remainingRetries: number) =>
          fetch(path, dispatch, callbacks, withIdentity, remainingRetries)
    ))
}

const post = (
 path: string,
 dispatch: Dispatch<StoreState>,
 callbacks?: Callbacks,
 data?: string,
 retries?: number
) => {
  if (retries === undefined) retries = 1
  apiPost(path, data)
    .then(response => handleResponse(response, path, dispatch, callbacks))
    .catch(error =>
      handleError(
        error, path, dispatch, callbacks, retries,
        (remainingRetries: number) =>
          post(path, dispatch, callbacks, data, remainingRetries)
    ))
}

function handleResponse(
    response: any, path: string,
    dispatch: Dispatch<StoreState>, callbacks?: Callbacks
) {
  let data = response.data || ''
  let dataByteArray = new Uint8Array(base64decode(data))
  let update = m.Update.decode(dataByteArray)
  dispatch(dataResponse(path, update))
  if (callbacks && callbacks.onSuccess) callbacks.onSuccess()
}

function handleError(
    error: any, path: string,
    dispatch: Dispatch<StoreState>, callbacks?: Callbacks,
    retries?: number, retryFunc?: (remainingRetries: number) => void
) {
  console.log("error:", error, error.response)
  console.log("retries:", retries)
  let errorCode = 404
  if (error.response && error.response.status) errorCode = error.response.status
  if (retries && errorCode == 401) {
    sessionManager.refreshSession(
      () => retryFunc(retries - 1),
      () => showError(error, path, dispatch, callbacks)
    )
    return
  }

  showError(error, path, dispatch, callbacks)
}

function showError(
  error: any, path: string,
  dispatch: Dispatch<StoreState>, callbacks?: Callbacks
) {
  let errorMessage = 'Request failed'
  if (error.message) errorMessage = error.message
  else if (error.toString) errorMessage = error.toString()

  let errorText = 'Request to [' + path + '] :: ' + errorMessage

  dispatch(dataError(path, errorText))
  if (callbacks && callbacks.onError) callbacks.onError()
}
