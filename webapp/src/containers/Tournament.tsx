import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournament, Callbacks } from '../actions/data'
import { Localisable, withLocaliser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import MatchDayLink from '../components/MatchDayLink'

interface Props extends Localisable {
  tournamentId: string
  tournament: m.Tournament
  matchDays: m.MatchDay[]
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
        { this.refreshComponent }
      </div>
    )
  }
}

const getTournamentIdFromUrl = makeGetUrlParameter('id')

const makeMapStateToProps = () => {
  let getTournament = makeGetTournament(getTournamentIdFromUrl)
  let getMatchDays = makeGetMatchDays(getTournamentIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      tournamentId: getTournamentIdFromUrl(state, props),
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props)
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
