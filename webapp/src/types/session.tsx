import { LoginStatus } from '../constants'

export interface SessionState {
  loginStatus: LoginStatus
  userId?: string
  errorMessage?: string
}

export const INITIAL_SESSION_STATE: SessionState = {
  loginStatus: LoginStatus.NotLoggedIn
}
