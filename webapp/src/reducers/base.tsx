import { BaseAction } from '../actions/base'
import { StoreState } from '../types'

export type Reducer<StateType> =
    (state: StateType, action: any & BaseAction<StateType>) =>
    Partial<StoreState>
