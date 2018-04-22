import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logOut } from '../actions/session'
import { isLoggedIn, getUserId } from '../selectors/session'
import { UserBoxView } from '../components/UserBoxView'

const mapStateToProps = (state: StoreState) => {
  return {
    isLoggedIn: isLoggedIn(state),
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

export const UserBox =
  connect(mapStateToProps, mapDispatchToProps)(UserBoxView)
