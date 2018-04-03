import { connect, Dispatch } from 'react-redux'
import { StoreState } from '../types'
import { models } from '../types/models.js'
import { Action } from '../actions';
import { DashboardView } from '../components/DashboardView'

const mapStateToProps = (state: StoreState) => {
  return { }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return { }
}

export const Dashboard = connect(mapStateToProps)(DashboardView)
