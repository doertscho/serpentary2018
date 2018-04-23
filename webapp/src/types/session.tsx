import { LoginStatus, LocaleIdentifier } from '../constants'

export interface SessionState {
  loginStatus: LoginStatus
  userId?: string
  errorMessage?: string
  locale?: LocaleIdentifier
}

export const INITIAL_SESSION_STATE: SessionState = {
  loginStatus: LoginStatus.NotLoggedIn
}
