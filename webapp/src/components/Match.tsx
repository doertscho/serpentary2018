import * as React from 'react'

import { models as m } from '../types/models'

export interface Props {
  match: m.Match
}

export const Match = ({ match }: Props) =>
  <span>
    { match.id }:
    { match.homeTeamId }
    vs.
    { match.awayTeamId }
  </span>
