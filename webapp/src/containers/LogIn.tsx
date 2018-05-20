import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect, withRouter } from 'react-router-dom'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logIn } from '../actions/session'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { getUserId } from '../selectors/session'

interface Props extends Localisable {
  userId: string
  referrer: string
  logIn: (username: string, password: string) => void
}

interface State {
  userId: string
  password: string
}

class view extends React.Component<Props, State> {

  render() {
    if (this.props.userId && this.props.userId.length)
      return <Redirect to={ this.props.referrer || '/' } />

    let l = this.localiser

    return (
      <div>
        <h1>{ l('LOG_IN_PAGE_TITLE', 'Log in') }</h1>
        <div>
          <input type="text"
            placeholder={
              l('LOG_IN_INPUT', 'Your user ID, or nick name, or email address')
            }
            value={this.state.userId} onChange={this.onUserIdChange} />
        </div>
        <div>
          <input type="password"
            placeholder={l('PASSWORD_INPUT', 'Your password')}
            value={this.state.password} onChange={this.onPasswordChange} />
        </div>
        <div>
          <button onClick={this.onButtonClick}>
            { l('LOG_IN_BUTTON', 'Log in') }
          </button>
        </div>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { userId: '', password: '' }

    this.localiser = props.l
    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  localiser: Localiser

  onUserIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ userId: event.target.value })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
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
