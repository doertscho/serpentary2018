import { models as m } from './models'

export interface SessionState {
  userId?: string
  unconfirmedUserId?: string
  preferredUserName?: string
  errorMessage?: string
  locale?: string
  currentSquadId?: string
}

export const INITIAL_SESSION_STATE: SessionState = {

}
