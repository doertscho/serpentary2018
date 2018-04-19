import * as React from 'react'

export interface Props {
  signUp: (username: string, password: string, email?: string) => void
}

export interface State {
  username: string
  password: string
  email: string
}

export class SignUpView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { username: '', password: '', email: '' }

    this.onUsernameChange = this.onUsernameChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ username: event.target.value })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value })
  }

  onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.signUp(
      this.state.username, this.state.password, this.state.email)
  }

  render() {
    return (
      <div>
        <h1>Sign up</h1>
        <div>
          <input type="text" placeholder="Nick name"
            value={this.state.username} onChange={this.onUsernameChange} />
        </div>
        <div>
          <input type="password" placeholder="Password"
            value={this.state.password} onChange={this.onPasswordChange} />
        </div>
        <div>
          <input type="text" placeholder="eMail (optional)"
            value={this.state.email} onChange={this.onEmailChange} />
        </div>
        <div>
          <button onClick={this.onButtonClick}>Sign up</button>
        </div>
      </div>
    )
  }
}
