import * as React from 'react'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { logOut, setLocale } from '../actions/session'
import {
  getUserId,
  getLocale,
  getPreferredUserName
} from '../selectors/session'
import { Localisable, withLocaliser, supportedLocales } from '../locales'

import UserIcon from '../components/UserIcon'

interface Props extends Localisable, RouteComponentProps<any> {
  userId?: string
  preferredUserName?: string
  logOut: () => void
  setLocale: (locale: string) => void
}

const userView = (props: Props) => {
  let userId = props.userId
  let userName = props.preferredUserName || userId
  let logOut = props.logOut
  let l = props.l
  return (
    <div className="userInfo">
      <div className="greeting">{ l('GREETING', 'Hello, {}!', userName) }</div>
      <div className="editProfile">
        <Link to="/profile">
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
        { l('GREETING_GUEST', 'Greetings, unknown entity!') }
      </div>
      <div className="signUpLink">
        <Link to="/sign-up">{ l('SIGN_UP', 'Sign up') }</Link>
      </div>
      <div className="logInLink">
        <Link to={{pathname: '/log-in', state: { from: props.location }}}>
          { l('LOG_IN', 'Log in') }
        </Link>
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

class view  extends React.Component<Props, {}> {

  render() {
    let userId = this.props.userId
    let userName = this.props.preferredUserName || userId
    let selectedView = userId ? userView(this.props) : guestView(this.props)
    return (
      <div className="userBox">
        <UserIcon userId={userId} userName={userName} />
        { selectedView }
        { localeSelector(this.props) }
      </div>
    )
  }
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    userId: getUserId(state),
    preferredUserName: getPreferredUserName(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    logOut: () => { dispatch(logOut()) },
    setLocale: (locale: string) => { dispatch(setLocale(locale)) }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(view))
