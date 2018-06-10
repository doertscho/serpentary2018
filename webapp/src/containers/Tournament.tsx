import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournament, Callbacks } from '../actions/data'
import { Localisable, withLocaliser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { getUserId } from '../selectors/session'
import {
  makeGetTournament,
  makeGetMatchDays,
  makeGetUserSquadsByTournament
} from '../selectors/Tournament'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import MatchDayLink from '../components/MatchDayLink'

interface Props extends Localisable {
  tournamentId: string
  tournament: m.Tournament
  matchDays: m.MatchDay[]
  squads: string[]
  userId: string
  fetchTournament: (tournamentId: string, callbacks?: Callbacks) => void
}

class tournamentPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['tournament']
  }

  shouldRefreshOnMount() {
    let matchDays = this.props.matchDays
    return (!matchDays || !matchDays.length)
  }

  requestData() {
    this.props.fetchTournament(
      this.props.tournamentId, this.requestDataCallbacks)
  }

  renderPools() {
    let squads = this.props.squads || []
    let l = this.props.l

    if (!squads.length) {
      if (!this.props.userId)
        return (
          <p>
            { l('LOG_IN_TO_SEE_BETS',
              'You must be logged in to see your squad\'s bets.') }
          </p>
        )
      else
        return (
          <p>
            { l('JOIN_SQUAD_TO_SEE_BETS',
              'You must join a squad and sign up for its pool to submit bets.')
            }
          </p>
        )
    }

    let tournament = this.props.tournament
    return (
      <ul>
        { squads.map(squadId =>
          <li key={squadId}>
            <Link to={tournament.id + '/pools/' + squadId}>#{squadId}</Link>
          </li>
        ) }
      </ul>
    )
  }

  renderWithData() {
    let tournament = this.props.tournament
    let matchDays = this.props.matchDays || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('TOURNAMENT_PAGE_TITLE', 'Tournament details') }</h1>
        <h2>{ l(tournament.name) }</h2>
        <h3>{ l('TOURNAMENT_MATCH_DAYS', 'Match days in this tournament') }</h3>
        <ul>
          { matchDays.map(matchDay =>
            <li key={matchDay.id}><MatchDayLink matchDay={matchDay} /></li>) }
        </ul>
        <h3>
          { l('TOURNAMENT_POOLS', 'Pools for this tournament by your squads') }
        </h3>
        { this.renderPools() }
        { this.refreshComponent }
      </div>
    )
  }
}

const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')

const makeMapStateToProps = () => {
  let getTournament = makeGetTournament(getTournamentIdFromUrl)
  let getMatchDays = makeGetMatchDays(getTournamentIdFromUrl)
  let getUserSquads = makeGetUserSquadsByTournament(getTournamentIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      tournamentId: getTournamentIdFromUrl(state, props),
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props),
      squads: getUserSquads(state, props),
      userId: getUserId(state)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchTournament: (tournamentId: string, callbacks?: Callbacks) => {
      dispatch(fetchTournament(tournamentId, callbacks))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(tournamentPage)
