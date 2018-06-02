import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logOut, setLocale } from '../actions/session'
import { getUserId, getLocale } from '../selectors/session'
import { Localisable, withLocaliser, supportedLocales } from '../locales'

import UserIcon from '../components/UserIcon'

interface Props extends Localisable {
  userId?: string
  logOut: () => void
  setLocale: (locale: string) => void
}

const userView = (props: Props) => {
  let userId = props.userId
  let logOut = props.logOut
  let l = props.l
  return (
    <div className="userInfo">
      <div className="greeting">{ l('GREETING', 'Hello, {}!', userId) }</div>
      <div className="editProfile">
        <Link to="/my-profile">
          { l('EDIT_PROFILE_SETTINGS', 'Profile and settings') }
        </Link>
      </div>
      <div className="logoutLink">
        <a href="#" onClick={logOut}>{ l('LOG_OUT', 'Log out') }</a>
      </div>
    </div>
  )
}

const guestView = (props: Props) => {
  let l = props.l
  return (
    <div className="userInfo">
      <div className="greeting">
        { l('GREETING_GUEST', 'Greetings, unkown entity!') }
      </div>
      <div className="signUpLink">
        <Link to="/sign-up">{ l('SIGN_UP', 'Sign up') }</Link>
      </div>
      <div className="logInLink">
        <Link to="/log-in">{ l('LOG_IN', 'Log in') }</Link>
      </div>
    </div>
  )
}

const localeSelector = (props: Props) => {
  let setLocale = props.setLocale
  let l = props.l
  return (
    <div className="localeSelect">
      <div>{ l('LOCALE', 'Locale') }:</div>
      <div>
        { supportedLocales.map(locale => {
          let onClick = (event: any) => {
            event.preventDefault()
            setLocale(locale)
          }
          return (
            <span key={locale}>
              <a href="#" onClick={onClick}>{ locale }</a>
              {' '}
            </span>
          )
        }) }
      </div>
    </div>
  )
}

const view = (props: Props) => {

  console.log("UserBox re-rendering")

  let userId = props.userId
  let selectedView = userId ? userView(props) : guestView(props)
  return (
    <div className="userBox">
      <UserIcon userId={userId} />
      { selectedView }
      { localeSelector(props) }
    </div>
  )
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    userId: getUserId(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logOut: () => { dispatch(logOut()) },
    setLocale: (locale: string) => { dispatch(setLocale(locale)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
