import * as constants from '../constants'
import { StoreState, Entity, ParentChildTable } from '../types'
import { models as m } from '../types/models'
import { Action } from '../actions'

export function rootReducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case constants.FETCH_DATA_REQUEST:
      console.log("request to fetch data.")
      return state
    case constants.FETCH_DATA_RESPONSE:
      console.log("response with fresh data.", action)
      return mergeWithUpdate(state, action.data)
    default:
      return state
  }
}

function mergeWithUpdate(state: StoreState, update: m.Update): StoreState {

  const newTournaments = mergeRecords(
      state.tournaments, update.tournaments, m.Tournament.create)

  const matchDayData = mergeRecordsAndRefs(
      state.matchDays, state.matchDaysByTournament, update.matchDays,
      m.MatchDay.create, u => u.tournamentId)
  const newMatchDays = matchDayData.state
  const newMatchDaysByTournament = matchDayData.refs

  const matchData = mergeRecordsAndRefs(
      state.matches, state.matchesByMatchDay, update.matches,
      m.Match.create, u => u.matchDayId)
  const newMatches = matchData.state
  const newMatchesByMatchDay = matchData.refs

  return {
    tournaments: newTournaments,
    matchDays: newMatchDays,
    matchDaysByTournament: newMatchDaysByTournament,
    matches: newMatches,
    matchesByMatchDay: newMatchesByMatchDay
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
    state: R[], refs: ParentChildTable,
    update: I[],
    makeRecord: (u: I) => R,
    getParentId: (u: I) => number
): { state: R[], refs: ParentChildTable } {

  const changed: R[] = []
  const newRefs: Relation[] = []
  update.forEach(u => {
    if (u.id && updateIsNewer(state[u.id], u)) {
      changed.push(makeRecord(u))
      if (!state[u.id])
        newRefs.push({ parentId: getParentId(u), childId: u.id })
    }
  })
  if (changed.length == 0) return { state, refs }
  if (newRefs.length == 0)
    return { state: copyAndMergeRecordArray(state, changed), refs }
  else
    return {
      state: copyAndMergeRecordArray(state, changed),
      refs: copyAndMergeReferenceArray(refs, newRefs)
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
