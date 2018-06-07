import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logIn } from '../actions/session'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { getUserId } from '../selectors/session'

interface Props extends Localisable, RouteComponentProps<any> {
  userId: string
  logIn: (username: string, password: string) => void
}

interface State {
  userId: string
  password: string
}

class view extends React.Component<Props, State> {

  render() {
    let referrer = '/'
    if (this.props.location
        && this.props.location.state
        && this.props.location.state.from) {
      referrer = this.props.location.state.from.pathname || '/'
    }
    if (this.props.userId)
      return <Redirect to={referrer} />
    let l = this.props.l
    return (
      <div>
        <h1>{ l('LOG_IN_PAGE_TITLE', 'Log in') }</h1>
        <form onSubmit={e => {
          e.preventDefault()
          this.submit()
        }}>
          <div className="formRow">
            <div className="formInput">
              <input type="text" value={this.state.userId}
                onChange={this.onUserIdChange} />
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l('LOG_IN_USER_ID_LABEL_HEAD', 'Who\'s there?') }
              </div>
              <div className="formLabelDetails">
                { l(
                  'LOG_IN_USER_ID_LABEL_DETAIL',
                  'You may use your user ID, display name, ' +
                      'or email address to log in.') }
              </div>
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <input type="password" value={this.state.password}
                onChange={this.onPasswordChange} />
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l('LOG_IN_PASSWORD_LABEL_HEAD', 'Your password') }
              </div>
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <button>
                { l('LOG_IN_BUTTON', 'Log in') }
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { userId: '', password: '' }

    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  onUserIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ userId: event.target.value })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  submit() {
    let userId = this.state.userId
    let password = this.state.password
    this.setState({ password: '' })
    this.props.logIn(userId, password)
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  return {
    userId: getUserId(state),
    referrer: props.referrer || '/'
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logIn: (username: string, password: string) => {
      dispatch(logIn(username, password))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
