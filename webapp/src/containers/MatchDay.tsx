import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { Callbacks, fetchMatchDay } from '../actions/data'
import {
  makeGetMatchDay,
  makeGetMatches,
  makeGetTournamentId
} from '../selectors/MatchDay'
import { makeGetUserSquadsByTournament } from '../selectors/Tournament'
import { makeGetNumberUrlParameter } from '../selectors/util'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import Match from '../components/Match'

interface Props extends Localisable {
  matchDayId: number,
  matchDay: m.MatchDay
  matches: m.Match[]
  squads: m.Squad[]
  fetchMatchDay: (id: number, callbacks?: Callbacks) => void
}

class matchDayPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['matchDay']
  }

  shouldRefreshOnMount() {
    let matches = this.props.matches
    return (!matches || !matches.length)
  }

  requestData() {
    this.props.fetchMatchDay(this.props.matchDayId, this.requestDataCallbacks)
  }

  renderWithData() {
    let matchDay = this.props.matchDay
    let matches = this.props.matches || []
    let squads = this.props.squads || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('MATCH_DAY_PAGE_TITLE', 'Match day') }</h1>
        <h2>#{matchDay.id}</h2>
        <h3>{ l('MATCH_DAY_MATCHES', 'Matches on this match day') }</h3>
        <ul>
          { matches.map(match =>
          <li key={match.id}><Match match={match} /></li>) }
        </ul>
        <h3>{ l('MATCH_DAY_SQUADS', 'Bets for this match day by squad') }</h3>
        <ul>
          { squads.map(squad =>
            <li key={squad.id}>
              <Link to={matchDay.id + '/bets/' + squad.name}>{squad.name}</Link>
            </li>
          ) }
        </ul>
        { this.refreshComponent }
      </div>
    )
  }
}

const getIdFromUrl = makeGetNumberUrlParameter('id')

const makeMapStateToProps = () => {
  let getMatchDay = makeGetMatchDay(getIdFromUrl)
  let getMatches = makeGetMatches(getIdFromUrl)
  let getTournamentId = makeGetTournamentId(getMatchDay)
  let getUserSquads = makeGetUserSquadsByTournament(getTournamentId)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      matchDayId: getIdFromUrl(state, props),
      matchDay: getMatchDay(state, props),
      matches: getMatches(state, props),
      squads: getUserSquads(state, props),
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchMatchDay: (id: number, callbacks?: Callbacks) => {
      dispatch(fetchMatchDay(id, callbacks))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(matchDayPage)
