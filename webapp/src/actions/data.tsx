import axios from 'axios'
import { Dispatch } from 'redux'

import { API_BASE_URL } from '../../conf/api'
import * as constants from '../constants'
import { models } from '../types/models'
import { StoreState } from '../types'
import { BaseDataAction } from './base'

export interface Callbacks {
  onSuccess?: () => void
  onError?: () => void
}

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
  data: models.Update
}
export function dataResponse(
    path: string, data: models.Update): DataResponse {
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
  callbacks?: Callbacks
) =>
  axios.request({
      url: API_BASE_URL + path,
      method: 'get',
      responseType: 'arraybuffer'
    })
    .then(response => {
      const update = models.Update.decode(new Uint8Array(response.data))
      dispatch(dataResponse(path, update))
      if (callbacks && callbacks.onSuccess) callbacks.onSuccess()
    })
    .catch(error => {
      dispatch(dataError(path, error))
      if (callbacks && callbacks.onError) callbacks.onError()
    })

function fetchData(path: string, callbacks?: Callbacks) {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(dataRequest(path))
    return fetch(path, dispatch, callbacks)
  }
}
