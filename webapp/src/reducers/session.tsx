import * as constants from '../constants'
import { SessionState } from '../types'
import { Reducer } from './base'

export const sessionReducer: Reducer<SessionState> = (state, action) => {
  switch(action.event) {
    case constants.RESPONSE:
      console.log("received session response:", action)
      return { }
    default:
      return { }
  }
}
