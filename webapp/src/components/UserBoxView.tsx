import * as React from 'react'
import { Link } from 'react-router-dom'

import { LoginStatus } from '../constants'

interface Props {
  loginStatus: LoginStatus
  userId?: string
  logOut: () => void
}

export default ({ loginStatus, userId, logOut }: Props) => {
  console.log("UserBoxView re-rendering")
  if (loginStatus == LoginStatus.LoggedIn)
    return (
      <div>
        Hello, { userId }!{' '}
        <Link to="/my-profile">Edit your profile</Link>{' '}
        or{' '}
        <strong onClick={logOut}>log out</strong>.
      </div>
    )
  else
    return (
      <div>
        Greetings, unkown entity!{' '}
        Please{' '}
        <Link to="/log-in">log in</Link>{' '}
        or{' '}
        <Link to="/sign-up">sign up</Link>.
      </div>
    )
}
