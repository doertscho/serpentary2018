import axios from 'axios'
import { Dispatch } from 'redux'

import { API_BASE_URL } from '../api-conf'
import * as constants from '../constants'
import { models } from '../types/models'
import { StoreState } from '../types'

export interface FetchDataRequest {
  type: constants.FETCH_DATA_REQUEST
  path: string
}
export function fetchDataRequest(path: string): FetchDataRequest {
  return {
    type: constants.FETCH_DATA_REQUEST
  , path: path
  }
}

export interface FetchDataResponse {
  type: constants.FETCH_DATA_RESPONSE
  path: string
  data: models.Update
}
export function fetchDataResponse(path: string, data: models.Update): FetchDataResponse {
  return {
    type: constants.FETCH_DATA_RESPONSE
  , path: path
  , data: data
  }
}

export interface FetchDataError {
  type: constants.FETCH_DATA_ERROR
  path: string
  error: any
}
export function fetchDataError(path: string, error: any): FetchDataError {
  return {
    type: constants.FETCH_DATA_ERROR
  , path: path
  , error: error
  }
}

const fetch = (path: string, dispatch: Dispatch<StoreState>) =>
  axios.request({
      url: API_BASE_URL + path
    , method: 'get'
    , responseType: 'arraybuffer'
    })
    .then(response => {
      const update = models.Update.decode(new Uint8Array(response.data))
      dispatch(fetchDataResponse(path, update))
    })
    .catch(error => {
      dispatch(fetchDataError(path, error))
    })

function fetchData(path: string) {
  return function(dispatch: Dispatch<StoreState>) {
    dispatch(fetchDataRequest(path))
    return fetch(path, dispatch)
  }
}

export const fetchTournaments = () => fetchData('/data')
export const fetchTournament = (id: number) => fetchData('/data')

export type Action =
  FetchDataRequest | FetchDataResponse | FetchDataError
