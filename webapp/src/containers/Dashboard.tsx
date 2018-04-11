import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { models } from '../types/models.js'
import { Action, fetchTournaments } from '../actions';
import { DashboardView } from '../components/DashboardView'
import { getTournaments } from '../selectors/index'

const mapStateToProps = (state: StoreState) => {
  return {
    tournaments: getTournaments(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    refreshTournaments: () => dispatch(fetchTournaments())
  }
}

export const Dashboard =
  connect(mapStateToProps, mapDispatchToProps)(DashboardView)
