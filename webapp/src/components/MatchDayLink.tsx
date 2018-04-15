import * as React from 'react'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'

export interface Props {
  matchDay: m.MatchDay
}

export const MatchDayLink = ({ matchDay }: Props) =>
  <Link to={'/match-days/' + matchDay.id}>
    {matchDay.name} (#{matchDay.id})
  </Link>
