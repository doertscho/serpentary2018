import * as React from 'react'
import { Link } from 'react-router-dom'

export interface Props {
  isLoggedIn: boolean
  userId?: string
  logOut: () => void
}

export const UserBoxView = ({ isLoggedIn, userId, logOut }: Props) => {
  console.log("UserBoxView re-rendering")
  if (isLoggedIn)
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
