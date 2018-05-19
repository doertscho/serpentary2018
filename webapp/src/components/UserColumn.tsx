import * as React from 'react'

import { models as m } from '../types/models'

interface Props {
  participants: m.User[]
}

export default ({ participants }: Props) =>
  <div className="users">
    { participants.map(user =>
    <div key={user.name} className="user">{user.name}</div>
    )}
  </div>
