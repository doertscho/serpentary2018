import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import { getSquads } from './data'
import { StringSelector, ModelSelector } from './util'

export function makeGetSquad(
  getSquadId: StringSelector
): ModelSelector<m.Squad>{
  return createSelector(
    [getSquads, getSquadId],
    (   squads,    squadId) => squads[squadId]
  )
}
