import * as React from 'react'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'

interface Props {
  tournament: m.Tournament
}

export default ({ tournament }: Props) =>
  <Link to={'/tournaments/' + tournament.id}>
    {tournament.name} (#{tournament.id})
  </Link>
