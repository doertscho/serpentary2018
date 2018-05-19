import { models as m } from './models'
import { LoginStatus } from '../constants'

export interface SessionState {
  loginStatus: LoginStatus
  userName?: string
  errorMessage?: string
  locale?: string
}

export const INITIAL_SESSION_STATE: SessionState = {
  loginStatus: LoginStatus.NotLoggedIn
}
