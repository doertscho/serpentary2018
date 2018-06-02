import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { StoreState } from '../types'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { signUp } from '../actions/session'
import { getSessionErrorMessage } from '../selectors/session'
import { getUserId } from '../selectors/session'

import ErrorBox from '../components/ErrorBox'

interface Props extends Localisable {
  userId: string
  referrer: string
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
    if (this.props.userId)
      return <Redirect to={ this.props.referrer || '/' } />
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SIGN_UP_PAGE_TITLE', 'Sign up') }</h1>
        <div className="formRow">
          <div className="formInput">
            <input type="text" value={this.state.userId}
              onChange={this.onUserIdChange} />
          </div>
          <div className="formLabel">
            <div className="formLabelHead">
              { l('SIGN_UP_USER_ID_LABEL_HEAD', 'Pick your user ID') }
            </div>
            <div className="formLabelDetails">
              { l(
                'SIGN_UP_USER_ID_LABEL_DETAIL',
                'The database will know you by this name – ' +
                    'only lowercase letters, numbers and hyphens allowed. ' +
                    'Don\'t worry, you can pick a display name later.') }
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
              { l('SIGN_UP_PASSWORD_LABEL_HEAD', 'Pick your password') }
            </div>
            <div className="formLabelDetails">
              { l(
                'SIGN_UP_PASSWORD_LABEL_DETAIL',
                'It must be at least 8 characters long ' +
                    'and have at least one uppercase letter, ' +
                    'one lowercase letter and one number.') }
            </div>
          </div>
        </div>
        <div className="formRow">
          <div className="formInput">
            <input type="text" value={this.state.email}
              onChange={this.onEmailChange} />
          </div>
          <div className="formLabel">
            <div className="formLabelHead">
              { l('SIGN_UP_EMAIL_LABEL_HEAD',
                'Enter your email – if you want') }
            </div>
            <div className="formLabelDetails">
              { l(
                'SIGN_UP_EMAIL_LABEL_DETAIL',
                'Enter a valid email address, to which a confirmation link ' +
                    'will be sent. ' +
                    'You don\'t have to, however in that case ' +
                    'you\'ll have to give me a nudge ' +
                    'so I can unlock your account manually.') }
            </div>
          </div>
        </div>
        <div className="formRow">
          <div className="formInput">
            <button onClick={this.onButtonClick}>
              { l('SIGN_UP_BUTTON', 'Count me in!') }
            </button>
          </div>
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
    let newUserId = event.target.value || ''
    newUserId = newUserId.replace(/[^a-z0-9-]/, '')
    if (newUserId.length > 24) newUserId = newUserId.substring(0, 24)
    this.setState({ userId: newUserId })
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

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  return {
    userId: getUserId(state),
    referrer: props.referrer || '/',
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
