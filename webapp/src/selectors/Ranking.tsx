import { createSelector, ParametricSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, joinKeys } from '../types/data'
import { getRankingTables } from './data'
import { StringSelector, ModelSelector } from './util'

export function makeGetRankingTable(
  getTournamentId: StringSelector,
  getMatchDayId: StringSelector,
  getSquadId: StringSelector
): ModelSelector<m.RankingTable> {
  return createSelector(
    [getRankingTables, getTournamentId, getMatchDayId, getSquadId],
    (   rankingTables,    tournamentId,    matchDayId,    squadId) =>
      rankingTables[joinKeys(squadId, tournamentId, matchDayId)]
  )
}
