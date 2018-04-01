import { StoreState } from '../types'
import { Action } from '../actions'
import * as constants from '../constants'

export function rootReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case constants.DO_SOMETHING:
      return state
    default:
      return state
  }
}
