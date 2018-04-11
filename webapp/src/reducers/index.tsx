import { StoreState } from '../types'
import { Action } from '../actions'
import * as constants from '../constants'

export function rootReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case constants.FETCH_DATA_REQUEST:
      console.log("request to fetch data.")
      return state
    case constants.FETCH_DATA_RESPONSE:
      console.log("response with fresh data.", action)
      return state
    default:
      return state
  }
}
