import * as React from 'react'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'

interface Props {
  matchDay: m.MatchDay
}

export default ({ matchDay }: Props) =>
  <Link to={matchDay.tournamentId + '/match-days/' + matchDay.id}>
    #{matchDay.id}
  </Link>
