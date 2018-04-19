import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournaments } from '../actions/data'
import { DashboardView } from '../components/DashboardView'
import { getTournaments } from '../selectors/data'

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

export const Dashboard =
  connect(mapStateToProps, mapDispatchToProps)(DashboardView)
