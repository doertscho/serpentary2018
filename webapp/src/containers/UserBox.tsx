import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logOut, setLocale } from '../actions/session'
import { getLoginStatus, getUserId, getLocale } from '../selectors/session'
import { Localisable, withLocaliser } from '../locales'
import { LocaleIdentifier, LoginStatus } from '../constants'

interface Props extends Localisable {
  loginStatus: LoginStatus
  userId?: string
  logOut: () => void
  setLocale: (locale: LocaleIdentifier) => void
}

const userView = ({ userId, logOut, l }: Props) =>
  <span>
    { l('GREETING', 'Hello, {}!', userId) }
    {' | '}
    <Link to="/my-profile">
      { l('EDIT_PROFILE_SETTINGS', 'Edit your profile and settings') }
    </Link>
    {' | '}
    <a href="#" onClick={logOut}>
      { l('LOG_OUT', 'Log out') }
    </a>
  </span>

const guestView = ({ l }: Props) =>
  <span>
    { l('GREETING_GUEST', 'Greetings, unkown entity!') }
    {' | '}
    <Link to="/log-in">{ l('LOG_IN', 'Log in') }</Link>
    {' | '}
    <Link to="/sign-up">{ l('SIGN_UP', 'Sign up') }</Link>
  </span>

const localeSelector = ({ setLocale }: Props) =>
  <span>
    <a href="#" onClick={() => setLocale(LocaleIdentifier.de)}>de</a>
    { ' / ' }
    <a href="#" onClick={() => setLocale(LocaleIdentifier.en)}>en</a>
  </span>

const view = (props: Props) => {

  console.log("UserBox re-rendering")

  if (props.loginStatus == LoginStatus.LoggedIn)
    return (
      <div>
        { userView(props) }
        { ' | ' }
        { localeSelector(props) }
      </div>
    )
  else
    return (
      <div>
        { guestView(props) }
        { ' | ' }
        { localeSelector(props) }
      </div>
    )
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    loginStatus: getLoginStatus(state),
    userId: getUserId(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logOut: () => { dispatch(logOut()) },
    setLocale: (locale: LocaleIdentifier) => { dispatch(setLocale(locale)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
