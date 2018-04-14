import * as React from 'react';
import { Link } from 'react-router-dom'

import { imodels } from '../types/imodels'

export interface Props {
  tournament: imodels.Tournament
}

export const TournamentLink = ({ tournament }: Props) =>
  <Link to={'/tournaments/' + tournament.id}>
    {tournament.name} (#{tournament.id})
  </Link>
