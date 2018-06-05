import { createSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import {
  getTournaments,
  getMatchDays,
  getMatchDaysByTournament,
  getUsers,
  getSquads,
  getTeams,
  getTeamsByTournament
} from './data'
import { getUserId } from './session'
import { StringSelector, ModelSelector } from './util'

export const makeGetTournament = (getTournamentId: StringSelector) =>
  (state: StoreState, props?: any) =>
    getTournaments(state)[getTournamentId(state, props)]

export const makeGetMatchDays = (getTournamentId: StringSelector) =>
  createSelector(
    [getMatchDays, getMatchDaysByTournament, getTournamentId],
    (   matchDays,    matchDaysByTournament,    tournamentId) => {
      let matchDayIds = matchDaysByTournament[tournamentId]
      if (!matchDayIds) return []
      return matchDayIds.map(id => matchDays[id])
    }
  )

export const makeGetTeams = (getTournamentId: StringSelector) =>
  createSelector(
    [getTeams, getTeamsByTournament, getTournamentId],
    (   teams,    teamsByTournament,    tournamentId) => {
      let teamIds = teamsByTournament[tournamentId]
      if (!teamIds) return []
      return teamIds.map(id => teams[id])
    }
  )

export const makeGetTeamsSorted = (getTournamentId: StringSelector) =>
  createSelector(
    [getTeams, getTeamsByTournament, getTournamentId],
    (   teams,    teamsByTournament,    tournamentId) => {
      let teamIds = teamsByTournament[tournamentId]
      if (!teamIds) return []
      let selectedTeams = teamIds.map(id => teams[id])
      selectedTeams.sort((a: m.Team, b: m.Team) => {
        if (a.id < b.id) return -1;
        if (a.id > b.id) return 1;
        return 0;
      })
      return selectedTeams
    }
  )

export const makeGetTeamsById = (getTeams: ModelSelector<m.Team[]>) =>
  createSelector(
    [getTeams],
    (   teams) => {
      let teamsById: { [id: string]: m.Team } = { }
      for (let i = 0; i < teams.length; i++) {
        let team = teams[i]
        teamsById[team.id] = team
      }
      return teamsById
    }
  )

export const makeGetUserSquadsByTournament =
    (getTournamentId: StringSelector) =>
  createSelector(
    [getUserId, getUsers, getTournamentId],
    (   userId,    users,    tournamentId) => {
      console.log("extracting pools", userId, tournamentId, users)
      if (!userId || !userId.length) return []
      let user = users[userId]
      if (!user || !user.pools) return []
      console.log("checking user pools: " + user.pools)
      let squadIds = []
      for (let i = 0; i < user.pools.length; i++) {
        let poolId = user.pools[i]
        let pos = poolId.indexOf('/' + tournamentId)
        console.log("pos in ", poolId, pos)
        if (pos !== -1) {
          let squadId = poolId.substring(0, pos)
          squadIds.push(squadId)
        }
      }
      return squadIds
    }
  )
