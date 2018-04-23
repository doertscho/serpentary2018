import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { signUp } from '../actions/session'
import { getSessionErrorMessage } from '../selectors/session'

import ErrorBox from '../components/ErrorBox'

interface Props extends Localisable {
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

class view extends React.Component<Props, State> {

  render() {
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SIGN_UP_PAGE_TITLE', 'Sign up') }</h1>
        <div>
          <input type="text" placeholder={l('USER_ID_INPUT', 'User ID')}
            value={this.state.userId} onChange={this.onUserIdChange} />
        </div>
        <div>
          <input type="password"
            placeholder={l('PASSWORD_INPUT', 'Your password')}
            value={this.state.password} onChange={this.onPasswordChange} />
        </div>
        <div>
          <input type="text"
            placeholder={l('EMAIL_INPUT', 'Your email address')}
            value={this.state.email} onChange={this.onEmailChange} />
        </div>
        <div>
          <button onClick={this.onButtonClick}>
            { l('SIGN_UP_BUTTON', 'Count me in!') }
          </button>
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

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    errorMessage: getSessionErrorMessage(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    signUp: (
        userId: string,
        password: string,
        email: string
      ) => {
        dispatch(signUp(userId, password, email))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
