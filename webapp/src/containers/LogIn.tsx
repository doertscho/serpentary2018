import { connect, Dispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logIn } from '../actions/session'
import { getLoginStatus } from '../selectors/session'

import view from '../components/LogInView'

const mapStateToProps = (state: StoreState, props: any) => {
  return {
    loginStatus: getLoginStatus(state),
    referrer: props.referrer || '/'
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logIn: (username: string, password: string) => {
      dispatch(logIn(username, password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
