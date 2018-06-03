import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'

import { StoreState } from '../types'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { signUp } from '../actions/session'
import { getSessionErrorMessage } from '../selectors/session'
import { getUserId, getUnconfirmedUserId } from '../selectors/session'

import ErrorBox from '../components/ErrorBox'

interface Props extends Localisable {
  userId: string
  unconfirmedUserId: string
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
  passwordCheck: string
  email: string
}

class view extends React.Component<Props, State> {

  render() {
    if (this.props.userId)
      return <Redirect to={ this.props.referrer || '/' } />
    if (this.props.unconfirmedUserId)
      return this.renderSuccessPage()
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SIGN_UP_PAGE_TITLE', 'Sign up') }</h1>
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
              { this.passwordValid() ? null :
                <div className="formLabelDetails validationError">
                  { l('SIGN_UP_PASSWORD_INVALID',
                      'Your password does not match all criteria!') }
                </div>
              }
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <input type="password" value={this.state.passwordCheck}
                onChange={this.onPasswordCheckChange} />
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l('SIGN_UP_PASSWORD_CHECK_LABEL_HEAD',
                  'Repeat that password (just to be sure)') }
              </div>
              { this.passwordsMatch() ? null :
                <div className="formLabelDetails validationError">
                  { l('SIGN_UP_PASSWORD_MISMATCH',
                      'The passwords do not match!') }
                </div>
              }
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
              { this.emailValid() ? null :
                <div className="formLabelDetails validationError">
                  { l('SIGN_UP_EMAIL_INVALID',
                      'This email address does not look valid.') }
                </div>
              }
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <button disabled={!this.allValid()}>
                { l('SIGN_UP_BUTTON', 'Count me in!') }
              </button>
            </div>
            <div className="formLabel">
              { !this.props.errorMessage ? null :
                <div className="formLabelDetails validationError">
                  {this.props.errorMessage}
                </div>
              }
            </div>
          </div>
        </form>
      </div>
    )
  }

  renderSuccessPage() {
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SIGN_UP_PAGE_TITLE', 'Sign up') }</h1>
        <p>
          { l('SIGN_UP_SUCCESS',
              'Thanks, {}, your registration was successful. ' +
              'Please check your email to confirm your account ' +
              'or let me know so I can activate it manually.',
              this.props.unconfirmedUserId
            ) }
        </p>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { userId: '', password: '', passwordCheck: '', email: '' }

    this.onUserIdChange = this.onUserIdChange.bind(this)
    this.onPasswordChange = this.onPasswordChange.bind(this)
    this.onPasswordCheckChange = this.onPasswordCheckChange.bind(this)
    this.onEmailChange = this.onEmailChange.bind(this)
    this.submit = this.submit.bind(this)
    this.passwordValid = this.passwordValid.bind(this)
    this.passwordsMatch = this.passwordsMatch.bind(this)
    this.emailValid = this.emailValid.bind(this)
    this.allValid = this.allValid.bind(this)
  }

  onUserIdChange(event: React.ChangeEvent<HTMLInputElement>) {
    let newUserId = event.target.value || ''
    newUserId = newUserId.toLowerCase()
    newUserId = newUserId.replace(/[_.]/, '-')
    newUserId = newUserId.replace(/[^a-z0-9-]/, '')
    if (newUserId.length > 24) newUserId = newUserId.substring(0, 24)
    this.setState({ userId: newUserId })
  }

  onPasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ password: event.target.value })
  }

  onPasswordCheckChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ passwordCheck: event.target.value })
  }

  onEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ email: event.target.value })
  }

  submit() {
    this.props.signUp(
      this.state.userId,
      this.state.password,
      this.state.email
    )
  }

  passwordValid() {
    let password = this.state.password
    if (!password) return true
    if (password.length < 8) return false
    if (!password.match(/[a-z]/)) return false
    if (!password.match(/[A-Z]/)) return false
    if (!password.match(/[0-9]/)) return false
    return true
  }

  emailValid() {
    let email = this.state.email
    if (!email) return true
    return email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-z]+$/)
  }

  passwordsMatch() {
    return this.state.password == this.state.passwordCheck
  }

  allValid() {
    return this.state.password && this.passwordValid() &&
      this.state.passwordCheck && this.passwordsMatch() &&
      this.state.userId &&
      this.emailValid()
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  return {
    userId: getUserId(state),
    unconfirmedUserId: getUnconfirmedUserId(state),
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
