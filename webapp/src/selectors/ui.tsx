import { StoreState } from '../types'
import { getUi } from './index'

export const getPopoverElement =
    (state: StoreState) => getUi(state).popoverElement
