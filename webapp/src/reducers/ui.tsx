import * as constants from '../constants'
import { UiState } from '../types/ui'
import { UiAction } from '../actions'
import { Reducer } from './base'

export const uiReducer: Reducer<UiState, UiAction> = (state, action) => {
  switch(action.operation) {
    case constants.SHOW_POPOVER:
      return { ui: { popoverElement: action.popoverElement } }
    case constants.HIDE_POPOVER:
      return { ui: { popoverElement: null } }
    case constants.HIDE_ERROR:
      return { errorMessage: null }
    default:
      return { }
  }
}
