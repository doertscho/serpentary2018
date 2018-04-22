import * as constants from '../constants'
import { StoreState } from '../types'
import { DataState } from '../types/data'
import { SessionState } from '../types/session'

export interface InitAction {
  type: constants.INIT
}

export type ActionType = constants.DATA | constants.SESSION

export type ActionEvent =
  constants.REQUEST | constants.RESPONSE | constants.ERROR

export interface BaseAction<StateType> {
  type: ActionType
  event: ActionEvent
}

export interface BaseDataAction extends BaseAction<DataState> {
  type: constants.DATA
}

export type SessionOperation =
  constants.SIGN_UP | constants.LOG_IN | constants.LOG_OUT

export interface BaseSessionAction extends BaseAction<SessionState> {
  type: constants.SESSION
  operation: SessionOperation
}
