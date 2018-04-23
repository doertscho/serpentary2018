import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournaments } from '../actions/data'
import { getTournaments } from '../selectors/data'
import { models as m } from '../types/models'

import TournamentLink from '../components/TournamentLink'

interface Props {
  tournaments: m.Tournament[]
  refreshTournaments: () => void
}

const view = ({ tournaments, refreshTournaments }: Props) => {
  console.log("Dashboard re-rendering")
  return (
    <div>
      <h1>Tournament list</h1>
      <ul>
        { tournaments.map(t => <li><TournamentLink tournament={t} /></li>) }
      </ul>
      <div>
        <span onClick={refreshTournaments}>Neu laden</span>
      </div>
    </div>
  )
}
const mapStateToProps = (state: StoreState) => {
  return {
    tournaments: getTournaments(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    refreshTournaments: () => {
      dispatch(fetchTournaments())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
