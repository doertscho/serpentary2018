import * as constants from '../constants'
import * as data from './data'
import * as session from './session'

export type Action =
  data.DataRequest | data.DataResponse | data.DataError |
  session.SessionRequest | session.SessionResponse | session.SessionError