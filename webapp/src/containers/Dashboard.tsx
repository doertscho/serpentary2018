import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { StoreState } from '../types'
import { Action } from '../actions'
import { models as m } from '../types/models'
import { Localisable, withLocaliser } from '../locales'
import { fetchTournaments, Callbacks } from '../actions/data'
import { getTournamentsList } from '../selectors/data'

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
        <p>
          { l('DASHBOARD_INTRO_TEXT',
            'Welcome to this little football pool app. ' +
            'Finally there is a way to prove to the world ' +
            '(or your colleagues or friends) ' +
            'that you are the single greatest expert about football. ' +
            'Predict the results of the world cup matches, ' +
            'win points for correct bets, and climb the leaderbord. ' +
            'In order to join a pool, ' +
            'someone needs to share their squad\'s page link with you. ' +
            'For more information please check the Rules page.'
          )}
        </p>
        <p>
          { l('DASHBOARD_SUGGESTIONS_TEXT',
            'This page currently looks rather empty. ' +
            'For any suggestions on what could make this page more useful, ' +
            'please use the issue tracker of this project ' +
            'which you can find via the bug icon at the top.'
          )}
        </p>
        <h2>{ l('DASHBOARD_TOURNAMENTS', 'Currently active tournaments') }</h2>
        <ul>
          { tournaments.map(t =>
            <li key={t.id}><TournamentLink tournament={t} /></li>) }
        </ul>
        <h2>{ l('DASHBOARD_POOLS', 'Currently active pools') }</h2>
        { tournaments.map(t =>
          (!t.pools || !t.pools.length) ? null : (
            <ul key={'pools-' + t.id}>
              { t.pools.map(squadId =>
                <li key={t.id + '/' + squadId}>
                  <Link to={'/tournaments/' + t.id + '/pools/' + squadId}>
                    { l(t.name) }
                  </Link>
                  {' by '}
                  <Link to={'/squads/' + squadId}>#{squadId}</Link>
                </li>
              )}
            </ul>
          )
        ) }
        { this.refreshComponent }
      </div>
    )
  }
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    tournaments: getTournamentsList(state)
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
