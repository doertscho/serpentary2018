import { BaseAction } from '../actions/base'
import { StoreState } from '../types'

export type Reducer<ActionType> =
    (state: StoreState, action: ActionType) => Partial<StoreState>
