import * as React from 'react'

import ErrorBox from './ErrorBox'

interface Props {
  signUp: (
      userId: string,
      password: string,
      email: string
    ) => void
  errorMessage: string
}

interface State {
  userId: string
  password: string
  email: string
}

export default class SignUpView extends React.Component<Props, State> {

  render() {
    return (
      <div>
        <h1>Sign up</h1>
        <div>
          <input type="text" placeholder="User ID"
            value={this.state.userId} onChange={this.onUserIdChange} />
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
        <ErrorBox message={this.props.errorMessage} />
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { userId: '', password: '', email: '' }

    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.onButtonClick = this.onButtonClick.bind(this)
  }

  onUserIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ userId: event.target.value })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value })
  }

  onButtonClick(event: React.MouseEvent<HTMLButtonElement>) {
    this.props.signUp(
      this.state.userId,
      this.state.password,
      this.state.email
    )
  }
}
