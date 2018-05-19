import * as constants from '../constants'
import {
  DataState,
  Entity,
  ParentChildTable,
  Map,
  joinKeys
} from '../types/data'
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

const useId: (u: { id: number }) => string = (u) => '' + u.id

function mergeWithUpdate(
    state: DataState, update: m.Update): DataState {

  let newTournaments = mergeRecords(
      state.tournaments, update.tournaments, m.Tournament.create, useId)

  let newUsers = mergeRecords(
      state.users, update.users, m.User.create, u => u.name)

  let newSquads = mergeRecords(
      state.squads, update.squads, m.Squad.create, s => s.name)

  let poolsData = mergeRecordsAndRefs(
      state.pools, update.pools, m.Pool.create,
      c => joinKeys(c.squadName, c.tournamentId),
      [state.poolsByTournament, state.poolsBySquad],
      [c => '' + c.tournamentId,     c => c.squadName]
    )
  let newPools = poolsData.state
  let newPoolsByTournament = poolsData.refs[0]
  let newPoolsBySquad = poolsData.refs[1]

  let matchDayData = mergeRecordsAndRefs(
      state.matchDays, update.matchDays, m.MatchDay.create, useId,
      [state.matchDaysByTournament],
      [c => '' + c.tournamentId]
    )
  let newMatchDays = matchDayData.state
  let newMatchDaysByTournament = matchDayData.refs[0]

  let matchData = mergeRecordsAndRefs(
      state.matches, update.matches, m.Match.create, useId,
      [state.matchesByMatchDay],
      [c => '' + c.matchDayId]
    )
  let newMatches = matchData.state
  let newMatchesByMatchDay = matchData.refs[0]

  let betsData = mergeRecordsAndRefs(
      state.bets, update.bets, m.MatchDayBetBucket.create,
      c => joinKeys(c.squadName, c.matchDayId), [], []
    )
  let newBets = betsData.state

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
    state: Map<R>, update: I[],
    makeRecord: (u: I) => R, getKey: (u: I) => string
): Map<R> {
  const changed: R[] = []
  update.forEach(u => {
    if (updateIsNewer(state[getKey(u)], u)) changed.push(makeRecord(u))
  })
  if (changed.length == 0) return state
  else return copyAndMergeRecordMap(state, changed, getKey)
}

function mergeRecordsAndRefs<I extends Entity, R extends I>(
    state: Map<R>, update: I[],
    makeRecord: (u: I) => R, getKey: (u: I) => string,
    refs: ParentChildTable[],
    refsGetParentIdFuncs: ((u: I) => string)[]
): {
  state: Map<R>,
  refs: ParentChildTable[]
} {

  let changed: R[] = []
  let newRefs: Relation[][] = []
  for (var i = 0; i < refsGetParentIdFuncs.length; i++) {
    newRefs[i] = []
  }

  for (var i = 0; i < update.length; i++) {
    let u = update[i]
    let key = getKey(u)
    if (updateIsNewer(state[key], u)) {
      changed.push(makeRecord(u))
      if (!state[key]) {
        for (var j = 0; j < refsGetParentIdFuncs.length; j++) {
          newRefs[j].push({
            parentId: refsGetParentIdFuncs[j](u),
            childId: key
          })
        }
      }
    }
  }
  if (changed.length == 0) return { state, refs }
  if (newRefs.length == 0 || newRefs[0].length == 0)
    return {
      state: copyAndMergeRecordMap(state, changed, getKey),
      refs
    }
  else {
    let mergedRefs = []
    for (var i = 0; i < refsGetParentIdFuncs.length; i++) {
      mergedRefs[i] = copyAndMergeReferenceArray(refs[i], newRefs[i])
    }
    return {
      state: copyAndMergeRecordMap(state, changed, getKey),
      refs: mergedRefs
    }
  }
}

function updateIsNewer<T extends Entity>(state: T, update: T): boolean {
  return (!state || !state.updated
      || (update.updated && state.updated < update.updated))
}

function copyAndMergeRecordMap<I extends Entity, R extends I>(
    input: Map<R>, changes: R[], getKey: (u: I) => string): Map<R> {
  const output: Map<R> = {}
  for (let key in input) {
    output[key] = input[key]
  }
  changes.forEach(e => { output[getKey(e)] = e })
  return output
}

interface Relation {
  parentId: string
  childId: string
}

function copyAndMergeReferenceArray(
    input: ParentChildTable, newLinks: Relation[]): ParentChildTable {
  let output: ParentChildTable = {}
  for (let parentId in input) {
    let refs = input[parentId]
    if (refs) {
      output[parentId] = []
      refs.forEach(childId => { output[parentId].push(childId) })
    }
  }
  newLinks.forEach(r => {
    if (!output[r.parentId]) output[r.parentId] = [r.childId]
    else output[r.parentId].push(r.childId)
  })
  return output
}
