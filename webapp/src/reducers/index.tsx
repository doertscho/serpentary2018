import * as constants from '../constants'
import { StoreState } from '../types'
import { models } from '../types/models'
import { imodels } from '../types/imodels'
import { Action } from '../actions'

function mergeWithUpdate(state: StoreState, update: models.Update): StoreState {

  const oldTournaments = state.tournaments
  const newTournaments = update.tournaments
  var mergedTournaments = oldTournaments
  for (let t of newTournaments) {
    console.log("adding/updating tournament:", t)
    mergedTournaments = mergedTournaments.set(t.id, new imodels.Tournament(t))
  }

  const oldMatchDays = state.matchDays
  const newMatchDays = update.matchDays
  var mergedMatchDays = oldMatchDays
  for (let md of newMatchDays) {
    console.log("adding/updating match day:", md)
    mergedMatchDays = mergedMatchDays.set(md.id, models.MatchDay.create(md))
  }
  console.log("old/new:", oldTournaments, mergedTournaments);
  console.log("old/new:", oldMatchDays, mergedMatchDays);

  return new StoreState({
    tournaments: mergedTournaments
  , matchDays: mergedMatchDays
  })
}

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
