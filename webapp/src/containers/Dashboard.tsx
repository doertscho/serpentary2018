import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { models as m } from '../types/models'
import { Localisable, withLocaliser } from '../locales'
import { fetchTournaments } from '../actions/data'
import { getTournaments } from '../selectors/data'

import TournamentLink from '../components/TournamentLink'

interface Props extends Localisable {
  tournaments: m.Tournament[]
  refreshTournaments: () => void
}

const view = ({ tournaments, refreshTournaments, l }: Props) => {
  console.log("Dashboard re-rendering")
  return (
    <div>
      <h1>{ l('DASHBOARD_PAGE_TITLE', 'Dashboard') }</h1>
      <ul>
        { tournaments.map(t => <li><TournamentLink tournament={t} /></li>) }
      </ul>
      <div>
        <span onClick={refreshTournaments}>
          { l('REFRESH', 'Refresh') }
        </span>
      </div>
    </div>
  )
}
const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    tournaments: getTournaments(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    refreshTournaments: () => {
      dispatch(fetchTournaments())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
