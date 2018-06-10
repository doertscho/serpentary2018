import * as React from 'react'
import { Dispatch } from 'redux'

import * as constants from '../constants'
import { models as m } from '../types/models'
import { StoreState } from '../types'
import {
  BaseUiAction,
  UiOperation
} from './base'

export interface UiRequest extends BaseUiAction {
  event: constants.REQUEST
  operation: UiOperation
  popoverElement?: React.ReactElement<any>
}

export function showPopover(
    popoverElement: React.ReactElement<any>): UiRequest {
  return {
    type: constants.UI,
    event: constants.REQUEST,
    operation: constants.SHOW_POPOVER,
    popoverElement: popoverElement
  }
}

export function hidePopover(): UiRequest {
  return {
    type: constants.UI,
    event: constants.REQUEST,
    operation: constants.HIDE_POPOVER
  }
}

export function hideError(): UiRequest {
  return {
    type: constants.UI,
    event: constants.REQUEST,
    operation: constants.HIDE_ERROR
  }
}
