import axios from 'axios'

import { API_BASE_URL } from '../../conf/api'
import * as constants from '../constants'
import { StoreState } from '../types'
import { DataState } from '../types/data'
import { SessionState } from '../types/session'
import { UiState } from '../types/ui'
import { sessionManager } from '../session'

export interface InitAction {
  type: constants.INIT
  event: ActionEvent
}

export type ActionType = constants.DATA | constants.SESSION | constants.UI

export type ActionEvent =
  constants.REQUEST | constants.RESPONSE | constants.ERROR

export interface InitAction {
  type: constants.INIT
  event: ActionEvent
}

export interface BaseAction<StateType> {
  type: ActionType
  event: ActionEvent
}

export interface BaseDataAction extends BaseAction<DataState> {
  type: constants.DATA
}

export type SessionOperation =
  constants.SIGN_UP | constants.LOG_IN | constants.LOG_OUT |
  constants.SET_LOCALE

export interface BaseSessionAction extends BaseAction<SessionState> {
  type: constants.SESSION
  operation: SessionOperation
}

export type UiOperation =
  constants.SHOW_POPOVER | constants.HIDE_POPOVER |
  constants.HIDE_ERROR

export interface BaseUiAction extends BaseAction<UiState> {
  type: constants.UI
  operation: UiOperation
}

export const apiGet = (path: string, withIdentity?: boolean) => {
  let options = {
    url: API_BASE_URL + path,
    method: 'get',
    responseType: 'text',
    headers: { }
  }
  if (withIdentity) {
    options.headers = sessionManager.getHeadersForAuthorisedRequest()
  }
  return axios.request(options)
}

export const apiPost = (path: string, data?: string) => {
  let options = {
    url: API_BASE_URL + path,
    method: 'post',
    responseType: 'text',
    data: data,
    headers: sessionManager.getHeadersForAuthorisedRequest()
  }
  return axios.request(options)
}
