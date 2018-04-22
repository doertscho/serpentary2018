
export interface SessionState {
  isLoggedIn: boolean
  userId?: string
  errorMessage?: string
}

export const INITIAL_SESSION_STATE: SessionState = {
  isLoggedIn: false
}
