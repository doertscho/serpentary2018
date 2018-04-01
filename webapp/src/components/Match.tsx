import * as React from 'react';

import { models } from '../types/models'

export interface Props {
  match: models.Match
}

export const Match = ({ match }: Props) =>
  <span>
    { match.id }:
    { match.homeTeamId }
    vs.
    { match.awayTeamId }
  </span>
