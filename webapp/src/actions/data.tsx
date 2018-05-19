import { Dispatch } from 'redux'

import * as constants from '../constants'
import { models as m } from '../types/models'
import { StoreState } from '../types'
import { BaseDataAction, apiRequest } from './base'
import { sessionManager } from '../session'

export interface Callbacks {
  onSuccess?: () => void
  onError?: () => void
}

export const getMe = (callbacks?: Callbacks) =>
  fetchData('/me', callbacks, true)

export const fetchTournaments = (callbacks?: Callbacks) =>
  fetchData('/tournaments', callbacks)
export const fetchTournament = (id: number, callbacks?: Callbacks) =>
  fetchData('/tournaments/' + id, callbacks)
export const fetchMatchDay = (id: number, callbacks?: Callbacks) =>
  fetchData('/match-days/' + id, callbacks)
export const fetchBets =
    (matchDayId: number, squadName: string, callbacks?: Callbacks) =>
        fetchData('/match-days/' + matchDayId + '/bets/' + squadName, callbacks)

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
  error: any
}
export function dataError(path: string, error: any): DataError {
  return {
    type: constants.DATA,
    event: constants.ERROR,
    path: path,
    error: error
  }
}

const fetch = (
  path: string,
  dispatch: Dispatch<StoreState>,
  callbacks?: Callbacks,
  withIdentity?: boolean
) => {
  apiRequest(path, withIdentity)
    .then(response => {
      const update = m.Update.decode(new Uint8Array(response.data))
      dispatch(dataResponse(path, update))
      if (callbacks && callbacks.onSuccess) callbacks.onSuccess()
    })
    .catch(error => {
      dispatch(dataError(path, error))
      if (callbacks && callbacks.onError) callbacks.onError()
    })
}

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
