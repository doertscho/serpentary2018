import { DataState, INITIAL_DATA_STATE, SAMPLE_DATA_STATE } from './data'
import { SessionState, INITIAL_SESSION_STATE } from './session'
import { UiState, INITIAL_UI_STATE } from './ui'

export interface StoreState {
  isInitialised: boolean
  pendingRequests: string[]

  data: DataState
  session: SessionState
  ui: UiState
}

export const INITIAL_STATE: StoreState = {
  isInitialised: false,
  pendingRequests: [],
  data: INITIAL_DATA_STATE,
  session: INITIAL_SESSION_STATE,
  ui: INITIAL_UI_STATE
}

export const SAMPLE_STATE: StoreState = {
  isInitialised: false,
  pendingRequests: [],
  data: SAMPLE_DATA_STATE,
  session: INITIAL_SESSION_STATE,
  ui: INITIAL_UI_STATE
}
