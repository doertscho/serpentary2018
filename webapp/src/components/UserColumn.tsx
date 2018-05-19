import * as React from 'react'

import { models as m } from '../types/models'

interface Props {
  participants: m.User[]
}

export default ({ participants }: Props) =>
  <div className="users">
    { participants.map(user =>
    <div key={user.id} className="user">{user.id}</div>
    )}
  </div>
