import * as React from 'react'
import { Redirect } from 'react-router-dom'

import { LoginStatus } from '../constants'

interface Props {
  loginStatus: LoginStatus
  referrer: string
  logIn: (username: string, password: string) => void
}

interface State {
  userId: string
  password: string
}

export default class LogInView extends React.Component<Props, State> {

  render() {
    if (this.props.loginStatus == LoginStatus.LoggedIn) {
      return <Redirect to={ this.props.referrer || '/' } />
    }

    return (
      <div>
        <h1>Log in</h1>
        <div>
          <input type="text"
            placeholder="Your user ID, or nick name, or email address"
            value={this.state.userId} onChange={this.onUserIdChange} />
        </div>
        <div>
          <input type="password" placeholder="Your password"
            value={this.state.password} onChange={this.onPasswordChange} />
        </div>
        <div>
          <button onClick={this.onButtonClick}>Login</button>
        </div>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { userId: '', password: '' }

    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

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
