import * as constants from '../constants'
import * as data from './data'
import * as session from './session'
import * as ui from './ui'
import { InitAction } from './base'

export type DataAction =
  data.DataRequest | data.DataResponse | data.DataError

export type SessionAction =
  session.SessionRequest | session.SessionResponse | session.SessionError |
  session.SetLocale

export type UiAction =
  ui.UiEvent

export type Action =
  InitAction |
  data.DataRequest | data.DataResponse | data.DataError |
  session.SessionRequest | session.SessionResponse | session.SessionError |
  session.SetLocale |
  UiAction
