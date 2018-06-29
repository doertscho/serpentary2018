import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import {
  getTournaments,
  getMatchDays,
  getUsers
} from './data'
import { getUserId, getCurrentSquadId } from './session'
import { StringSelector, ModelSelector } from './util'

/* export const getCurrentSquadId =
  createSelector(
    [getCurrentSquadId, getUserId, getUsers],
    (   currentSquadId, userId,    users) => {
      if (!userId || !users) return null
      let user = users[userId]
      if (!user || !user.squads || !user.squads.length) return null
      return user.squads[0]
    }
  )*/

export const getCurrentTournamentId =
  createSelector(
    [getTournaments],
    (   tournaments) => {
      for (let tournamentId in tournaments) {
        return tournamentId
        // just throw out the first one you find for now
        // TODO: change as soon as this system manages more than one :)
      }
      return 'world-cup-2018'
    }
  )

export const getCurrentMatchDayId =
  createSelector(
    [getMatchDays],
    (   matchDays) => {
      /*for (let matchDayId in matchDays) {
        let matchDay = matchDays[matchDayId]
        return matchDay.id
        // just throw out the first one you find for now
        // TODO: change before the second one begins :)
      }*/
      return 'knockout-stage'
    }
  )
