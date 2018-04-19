import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logIn } from '../actions/session'
import { LogInView } from '../components/LogInView'

const mapStateToProps = (state: StoreState) => {
  return { }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logIn: (username: string, password: string) => {
      dispatch(logIn(username, password))
    }
  }
}

export const LogIn =
  connect(mapStateToProps, mapDispatchToProps)(LogInView)
