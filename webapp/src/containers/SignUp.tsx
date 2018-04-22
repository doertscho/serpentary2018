import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { signUp } from '../actions/session'
import { getSessionErrorMessage } from '../selectors/session'
import { SignUpView } from '../components/SignUpView'

const mapStateToProps = (state: StoreState) => {
  return {
    errorMessage: getSessionErrorMessage(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    signUp: (
        userId: string,
        password: string,
        nickName: string,
        email: string
      ) => {
        dispatch(signUp(userId, password, nickName, email))
      }
  }
}

export const SignUp =
  connect(mapStateToProps, mapDispatchToProps)(SignUpView)
