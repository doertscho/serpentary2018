import * as React from 'react'

import { models as m } from '../types/models'

interface Props {
  match: m.Match
}

export default ({ match }: Props) =>
  <span>
    { match.id }:
    { match.homeTeamId }
    vs.
    { match.awayTeamId }
  </span>
