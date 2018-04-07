import { StoreState } from '../types'
import { Action } from '../actions'
import * as constants from '../constants'

export function rootReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case constants.REQUEST_TOURNAMENTS_REFRESH:
      console.log("received request to refresh tournaments.")
      return state
    default:
      return state
  }
}
