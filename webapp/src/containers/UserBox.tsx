import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logOut } from '../actions/session'
import { getLoginStatus, getUserId } from '../selectors/session'

import view from '../components/UserBoxView'

const mapStateToProps = (state: StoreState) => {
  return {
    loginStatus: getLoginStatus(state),
    userId: getUserId(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logOut: () => {
      dispatch(logOut())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
