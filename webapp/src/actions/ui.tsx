import * as React from 'react'
import { Dispatch } from 'redux'

import * as constants from '../constants'
import { models as m } from '../types/models'
import { StoreState } from '../types'
import {
  BaseUiAction,
  UiOperation
} from './base'

export interface UiEvent extends BaseUiAction {
  event: constants.ONE_OFF
  operation: UiOperation
  popoverElement?: React.ReactElement<any>
  message?: string
}

export function showPopover(
    popoverElement: React.ReactElement<any>): UiEvent {
  return {
    type: constants.UI,
    event: constants.ONE_OFF,
    operation: constants.SHOW_POPOVER,
    popoverElement: popoverElement
  }
}

export function hidePopover(): UiEvent {
  return {
    type: constants.UI,
    event: constants.ONE_OFF,
    operation: constants.HIDE_POPOVER
  }
}

export function showMessage(message: string): UiEvent {
  return {
    type: constants.UI,
    event: constants.ONE_OFF,
    operation: constants.SHOW_MESSAGE,
    message: message
  }
}

export function hideMessage(): UiEvent {
  return {
    type: constants.UI,
    event: constants.ONE_OFF,
    operation: constants.HIDE_MESSAGE
  }
}
