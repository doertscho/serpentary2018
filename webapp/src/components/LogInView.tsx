import * as React from 'react'

export interface Props {
  logIn: (username: string, password: string) => void
}

export interface State {
  username: string
  password: string
}

export class LogInView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { username: '', password: '' }

    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.logIn(
      this.state.username, this.state.password)
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <div>
          <input type="text" placeholder="Nick name"
            value={this.state.username} onChange={this.onUsernameChange} />
        </div>
        <div>
          <input type="password" placeholder="Password"
            value={this.state.password} onChange={this.onPasswordChange} />
        </div>
        <div>
          <button onClick={this.onButtonClick}>Login</button>
        </div>
      </div>
    )
  }
}
