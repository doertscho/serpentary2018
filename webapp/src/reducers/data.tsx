import * as constants from '../constants'
import { DataState, Entity, ParentChildTable } from '../types/data'
import { models as m } from '../types/models'
import { DataAction } from '../actions'
import { DataResponse } from '../actions/data'
import { Reducer } from './base'

export const dataReducer: Reducer<DataState, DataAction> = (state, action) => {
  switch(action.event) {
    case constants.RESPONSE:
      return {
        data: mergeWithUpdate(state, (action as DataResponse).data)
      }
    default:
      return { }
  }
}

function mergeWithUpdate(
    state: DataState, update: m.Update): DataState {

  let newTournaments = mergeRecords(
      state.tournaments, update.tournaments, m.Tournament.create)

  let matchDayData = mergeRecordsAndRefs(
      state.matchDays, update.matchDays, m.MatchDay.create,
      [state.matchDaysByTournament],
      [c => c.tournamentId]
    )
  let newMatchDays = matchDayData.state
  let newMatchDaysByTournament = matchDayData.refs[0]

  let matchData = mergeRecordsAndRefs(
      state.matches, update.matches, m.Match.create,
      [state.matchesByMatchDay],
      [c => c.matchDayId]
    )
  let newMatches = matchData.state
  let newMatchesByMatchDay = matchData.refs[0]

  let newUsers = mergeRecords(state.users, update.users, m.User.create)

  let newSquads = mergeRecords(state.squads, update.squads, m.Squad.create)

  let poolsData = mergeRecordsAndRefs(
      state.pools, update.pools, m.Pool.create,
      [state.poolsByTournament, state.poolsBySquad],
      [c => c.tournamentId,     c => c.squadId])
  let newPools = poolsData.state
  let newPoolsByTournament = poolsData.refs[0]
  let newPoolsBySquad = poolsData.refs[1]

  let newBets = mergeRecords(
      state.bets, update.bets, m.MatchDayBetBucket.create)

  return {
    tournaments: newTournaments,
    matchDays: newMatchDays,
    matchDaysByTournament: newMatchDaysByTournament,
    matches: newMatches,
    matchesByMatchDay: newMatchesByMatchDay,

    users: newUsers,

    squads: newSquads,
    pools: newPools,
    poolsByTournament: newPoolsByTournament,
    poolsBySquad: newPoolsBySquad,

    bets: newBets,
  }
}

function mergeRecords<I extends Entity, R extends I>(
    state: R[], update: I[], makeRecord: (u: I) => R): R[] {
  const changed: R[] = []
  update.forEach(u => {
    if (u.id && updateIsNewer(state[u.id], u)) changed.push(makeRecord(u))
  })
  if (changed.length == 0) return state
  else return copyAndMergeRecordArray(state, changed)
}

function mergeRecordsAndRefs<I extends Entity, R extends I>(
    state: R[],
    update: I[],
    makeRecord: (u: I) => R,
    refs: ParentChildTable[],
    getParentId: ((u: I) => number)[]
): { state: R[], refs: ParentChildTable[] } {

  let changed: R[] = []
  let newRefs: Relation[][] = []
  for (var i = 0; i < getParentId.length; i++) {
    newRefs[i] = []
  }

  for (var i = 0; i < update.length; i++) {
    let u = update[i]
    if (u.id && updateIsNewer(state[u.id], u)) {
      changed.push(makeRecord(u))
      if (!state[u.id]) {
        for (var j = 0; j < getParentId.length; j++) {
          newRefs[j].push({ parentId: getParentId[j](u), childId: u.id })
        }
      }
    }
  }
  if (changed.length == 0) return { state, refs }
  if (newRefs.length == 0 || newRefs[0].length == 0)
    return { state: copyAndMergeRecordArray(state, changed), refs }
  else {
    let mergedRefs = []
    for (var i = 0; i < getParentId.length; i++) {
      mergedRefs[i] = copyAndMergeReferenceArray(refs[i], newRefs[i])
    }
    return {
      state: copyAndMergeRecordArray(state, changed),
      refs: mergedRefs
    }
  }
}

function updateIsNewer<T extends Entity>(state: T, update: T): boolean {
  return (!state || !state.updated
      || (update.updated && state.updated < update.updated))
}

function copyAndMergeRecordArray<T extends Entity>(
    input: T[], changes: T[]): T[] {
  const output: T[] = []
  input.forEach(e => { output[e.id] = e })
  changes.forEach(e => { output[e.id] = e })
  return output
}

interface Relation {
  parentId: number
  childId: number
}

function copyAndMergeReferenceArray(
    input: ParentChildTable, newLinks: Relation[]): ParentChildTable {
  const output: ParentChildTable = []
  input.forEach((refs: number[], parentId: number) => {
    if (refs) {
      output[parentId] = []
      refs.forEach(childId => { output[parentId].push(childId) })
    }
  })
  newLinks.forEach(r => {
    if (!output[r.parentId]) output[r.parentId] = [r.childId]
    else output[r.parentId].push(r.childId)
  })
  return output
}
