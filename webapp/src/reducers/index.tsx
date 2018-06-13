import * as constants from '../constants'
import { StoreState } from '../types'
import { Action } from '../actions'

import { dataReducer } from './data'
import { sessionReducer } from './session'
import { uiReducer } from './ui'

export function rootReducer(state: StoreState, action: Action): StoreState {
  console.log("got action:", action)
  switch (action.type) {
    case constants.DATA:
      return copyWith(state, dataReducer(state, action), action)
    case constants.SESSION:
      return copyWith(state, sessionReducer(state, action), action)
    case constants.UI:
      return copyWith(state, uiReducer(state, action), action)
    case constants.INIT:
      console.log("Initialisation finished.")
      return copyWith(state, { isInitialised: true }, action)
    default:
      console.log("No reducer available for action", action)
      return state
  }
}

function copyWith(
  state: StoreState, changed: Partial<StoreState>, action: Action
): StoreState {

  let requestId = getRequestId(action)
  let pendingRequests = state.pendingRequests
  if (requestId) {
    pendingRequests = []
    if (action.event == constants.REQUEST) {
      state.pendingRequests.forEach(e => { pendingRequests.push(e) })
      pendingRequests.push(requestId)
    } else {
      state.pendingRequests.forEach(e => {
        if (e != requestId) pendingRequests.push(e)
      })
    }
  }

  return {
    isInitialised: changed.isInitialised || state.isInitialised,
    pendingRequests: pendingRequests,
    message: changed.message !== undefined ?
        changed.message : state.message,
    messageType: changed.messageType !== undefined ?
        changed.messageType : state.messageType,

    data: changed.data || state.data,
    session: changed.session || state.session,
    ui: changed.ui || state.ui
  }
}

function getRequestId(action: Action): string {
  switch (action.type) {
    case constants.DATA:
      return action.path
    case constants.SESSION:
      return action.operation
  }
  return null
}
