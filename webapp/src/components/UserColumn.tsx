import * as React from 'react'

import { models as m } from '../types/models'

import UserIcon from './UserIcon'

interface Props {
  participants: m.User[]
}

export default ({ participants }: Props) =>
  <div className="users">
    { participants.map(user =>
    <div key={user.id} className="user">
      <UserIcon userId={user.id} userName={user.preferredName} />
      <span className="userName">{user.preferredName || user.id}</span>
    </div>
    )}
  </div>
