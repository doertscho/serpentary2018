import { Map } from 'immutable'
import { models } from './models.js'

export interface StoreState {
    matches: Map<number, models.Match>
}
