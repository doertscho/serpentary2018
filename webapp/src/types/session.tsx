import { models as m } from './models'

export interface SessionState {
  userId?: string
  unconfirmedUserId?: string
  errorMessage?: string
  locale?: string
}

export const INITIAL_SESSION_STATE: SessionState = {

}
