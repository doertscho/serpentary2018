import * as constants from '../constants'
import { StoreState, DataState, SessionState } from '../types'

export type ActionType = constants.DATA | constants.SESSION

export type ActionEvent =
  constants.REQUEST | constants.RESPONSE | constants.ERROR

export interface BaseAction<StateType> {
  type: ActionType
  event: ActionEvent
}

export interface DataAction extends BaseAction<DataState> {
  type: constants.DATA
}

export interface SessionAction extends BaseAction<SessionState> {
  type: constants.SESSION
}
