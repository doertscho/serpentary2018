import * as constants from '../constants'
import { StoreState } from '../types'
import { Action } from '../actions'

import { dataReducer } from './data'
import { sessionReducer } from './session'

export function rootReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case constants.DATA:
      return copyWith(state, dataReducer(state.data, action))
    case constants.SESSION:
      return copyWith(state, sessionReducer(state.session, action))
    default:
      console.log("No reducer available for action", action)
      return state
  }
}

function copyWith(state: StoreState, changed: Partial<StoreState>): StoreState {
  return {
    data: changed.data || state.data,
    session: changed.session || state.session
  }
}
