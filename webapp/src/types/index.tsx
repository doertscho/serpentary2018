import { DataState, INITIAL_DATA_STATE, SAMPLE_DATA_STATE } from './data'
import { SessionState, INITIAL_SESSION_STATE } from './session'

export interface StoreState {
  data: DataState
  session: SessionState
}

export const INITIAL_STATE: StoreState = {
  data: INITIAL_DATA_STATE,
  session: INITIAL_SESSION_STATE
}

export const SAMPLE_STATE: StoreState = {
  data: SAMPLE_DATA_STATE,
  session: INITIAL_SESSION_STATE
}
