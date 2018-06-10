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
    case constants.ERROR:
      return {
        errorMessage: action.errorMessage,
      }
    default:
      return { }
  }
}

function mergeWithUpdate(
    state: DataState, update: m.Update): DataState {

  let newTournaments = mergeRecords(
      state.tournaments, update.tournaments, m.Tournament.create, t => t.id)

  let newUsers = mergeRecords(
      state.users, update.users, m.User.create, u => u.id)

  let newSquads = mergeRecords(
      state.squads, update.squads, m.Squad.create, s => s.id)

  let poolsData = mergeRecordsAndRefs(
      state.pools, update.pools, m.Pool.create,
      p => joinKeys(p.squadId, p.tournamentId),
      [state.poolsByTournament, state.poolsBySquad],
      [p => p.tournamentId,     p => p.squadId]
    )
  let newPools = poolsData.state
  let newPoolsByTournament = poolsData.refs[0]
  let newPoolsBySquad = poolsData.refs[1]

  let matchDayData = mergeRecordsAndRefs(
      state.matchDays, update.matchDays, m.MatchDay.create,
      m => joinKeys(m.tournamentId, m.id),
      [state.matchDaysByTournament],
      [m => m.tournamentId]
    )
  let newMatchDays = matchDayData.state
  let newMatchDaysByTournament = matchDayData.refs[0]

  let matchData = mergeRecordsAndRefs(
      state.matches, update.matches, m.Match.create,
      m => joinKeys(m.tournamentId, m.matchDayId, m.id),
      [state.matchesByMatchDay],
      [m => joinKeys(m.tournamentId, m.matchDayId)]
    )
  let newMatches = matchData.state
  let newMatchesByMatchDay = matchData.refs[0]

  let teamsData = mergeRecordsAndRefs(
      state.teams, update.teams, m.Team.create,
      t => joinKeys(t.tournamentId, t.id),
      [state.teamsByTournament],
      [t => t.tournamentId]
    )
  let newTeams = teamsData.state
  let newTeamsByTournament = teamsData.refs[0]

  let newBets = mergeRecords(
      state.bets, update.bets, m.MatchDayBetBucket.create,
      b => joinKeys(b.squadId, b.tournamentId, b.matchDayId)
    )
  let newExtraQuestionBets = mergeRecords(
      state.extraQuestionBets, update.extraQuestionBets,
      m.ExtraQuestionBetBucket.create,
      b => joinKeys(b.squadId, b.tournamentId)
    )

  return {
    tournaments: newTournaments,
    matchDays: newMatchDays,
    matchDaysByTournament: newMatchDaysByTournament,
    matches: newMatches,
    matchesByMatchDay: newMatchesByMatchDay,
    teams: newTeams,
    teamsByTournament: newTeamsByTournament,

    users: newUsers,

    squads: newSquads,
    pools: newPools,
    poolsByTournament: newPoolsByTournament,
    poolsBySquad: newPoolsBySquad,

    bets: newBets,
    extraQuestionBets: newExtraQuestionBets
  }
}

function mergeRecords<I extends Entity, R extends I>(
    state: Map<R>, update: I[],
    makeRecord: (u: I) => R, getKey: (u: I) => string
): Map<R> {
  if (update.length == 0) return state
  else return copyAndMergeRecordMap(state, update, makeRecord, getKey)
}

function mergeRecordsAndRefs<I extends Entity, R extends I>(
    state: Map<R>, update: I[],
    makeRecord: (u: Partial<I>) => R, getKey: (u: I) => string,
    refs: ParentChildTable[],
    refsGetParentIdFuncs: ((u: I) => string)[]
): {
  state: Map<R>,
  refs: ParentChildTable[]
} {

  let newRefs: Relation[][] = []
  for (var i = 0; i < refsGetParentIdFuncs.length; i++) {
    newRefs[i] = []
  }

  for (var i = 0; i < update.length; i++) {
    let u = update[i]
    let key = getKey(u)
    if (!state[key]) {
      for (var j = 0; j < refsGetParentIdFuncs.length; j++) {
        newRefs[j].push({
          parentId: refsGetParentIdFuncs[j](u),
          childId: key
        })
      }
    }
  }

  if (update.length == 0) return { state, refs }
  if (newRefs.length == 0 || newRefs[0].length == 0)
    return {
      state: copyAndMergeRecordMap(state, update, makeRecord, getKey),
      refs
    }

  let mergedRefs = []
  for (var i = 0; i < refsGetParentIdFuncs.length; i++) {
    mergedRefs[i] = copyAndMergeReferenceArray(refs[i], newRefs[i])
  }
  return {
    state: copyAndMergeRecordMap(state, update, makeRecord, getKey),
    refs: mergedRefs
  }
}

function updateIsNewer<T extends Entity>(state: T, update: T): boolean {
  return (!state || !state.updated
      || (update.updated && state.updated < update.updated))
}

function copyAndMergeRecordMap<I extends Entity, R extends I>(
  input: Map<R>, changes: I[],
  makeRecord: (u: Partial<I>) => R, getKey: (u: I) => string
): Map<R> {
  const output: Map<R> = {}
  for (let key in input) {
    output[key] = input[key]
  }
  changes.forEach(e => {
    let key = getKey(e)
    if (!output[key]) {
      output[key] = makeRecord(e)
    } else {
      output[key] = mergeRecordAndUpdate(output[key], e, makeRecord)
    }
  })
  return output
}

function mergeRecordAndUpdate<I extends Entity, R extends I>(
  current: I, update: I, makeRecord: (u: Partial<I>) => R): R {

  let copy: Partial<I> = { }
  for (let prop in current) {
    if (!current.hasOwnProperty(prop)) continue
    copy[prop] = current[prop]
  }
  for (let prop in update) {
    if (!update.hasOwnProperty(prop)) continue
    if (!copy[prop] || !copy[prop].length) {
      copy[prop] = update[prop]
    } else if (copy[prop].length && update[prop].length) {
      copy[prop] = update[prop]
    }
  }
  return makeRecord(copy)
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
