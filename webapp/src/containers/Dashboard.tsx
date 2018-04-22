import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournaments } from '../actions/data'
import { getTournaments } from '../selectors/data'

import view from '../components/DashboardView'

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
