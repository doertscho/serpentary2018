import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { models as m } from '../types/models'
import { Localisable, withLocaliser } from '../locales'
import { fetchTournaments, Callbacks } from '../actions/data'
import { getTournaments } from '../selectors/data'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import TournamentLink from '../components/TournamentLink'

interface Props extends Localisable {
  tournaments: m.Tournament[]
  fetchTournaments: (callbacks?: Callbacks) => void
}

class dashboardPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['tournaments']
  }

  shouldRefreshOnMount() {
    // TODO:  this should not happen every time but only when it hasn't been
    // checked in a while (#15)
    let tournaments = this.props.tournaments
    return (!tournaments || !tournaments.length)
  }

  requestData() {
    this.props.fetchTournaments(this.requestDataCallbacks)
  }

  renderWithData() {
    let tournaments = this.props.tournaments
    let l = this.props.l
    return (
      <div>
        <h1>{ l('DASHBOARD_PAGE_TITLE', 'Dashboard') }</h1>
        <ul>
          { tournaments.map(t =>
            <li key={t.id}><TournamentLink tournament={t} /></li>) }
        </ul>
        { this.refreshComponent }
      </div>
    )
  }
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    tournaments: getTournaments(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchTournaments: (callbacks?: Callbacks) => {
      dispatch(fetchTournaments(callbacks))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(dashboardPage)
