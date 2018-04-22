import { BaseAction } from '../actions/base'
import { StoreState } from '../types'

export type Reducer<StateType, ActionType> =
    (state: StateType, action: ActionType) => Partial<StoreState>
