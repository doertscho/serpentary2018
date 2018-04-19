import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { signUp } from '../actions/session'
import { SignUpView } from '../components/SignUpView'

const mapStateToProps = (state: StoreState) => {
  return { }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    signUp: (username: string, password: string, email?: string) => {
      dispatch(signUp(username, password, email))
    }
  }
}

export const SignUp =
  connect(mapStateToProps, mapDispatchToProps)(SignUpView)
