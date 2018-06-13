import * as constants from '../constants'
import { UiState } from '../types/ui'
import { UiAction } from '../actions'
import { Reducer } from './base'

export const uiReducer: Reducer<UiAction> = (state, action) => {
  switch(action.operation) {
    case constants.SHOW_POPOVER:
      return {
        ui: copyWith(state.ui, { popoverElement: action.popoverElement })
      }
    case constants.HIDE_POPOVER:
      return { ui: copyWith(state.ui, { popoverElement: null }) }
    case constants.SHOW_MESSAGE:
      return { message: action.message, messageType: constants.MESSAGE_NOTE }
    case constants.HIDE_MESSAGE:
      return { message: null }
    default:
      return { }
  }
}

function copyWith(s: UiState, c: Partial<UiState>): UiState {
  return {
    popoverElement: c.popoverElement === undefined ?
        s.popoverElement : c.popoverElement
  }
}
