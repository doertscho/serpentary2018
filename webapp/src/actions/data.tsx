import axios from 'axios'
import { Dispatch } from 'redux'

import { API_BASE_URL } from '../../conf/api'
import * as constants from '../constants'
import { models } from '../types/models'
import { StoreState } from '../types'
import { BaseDataAction } from './base'

export const fetchTournaments = () => fetchData('/data')
export const fetchTournament = (id: number) => fetchData('/data')

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

const fetch = (path: string, dispatch: Dispatch<StoreState>) =>
  axios.request({
      url: API_BASE_URL + path,
      method: 'get',
      responseType: 'arraybuffer'
    })
    .then(response => {
      const update = models.Update.decode(new Uint8Array(response.data))
      dispatch(dataResponse(path, update))
    })
    .catch(error => {
      dispatch(dataError(path, error))
    })

function fetchData(path: string) {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(dataRequest(path))
    return fetch(path, dispatch)
  }
}
