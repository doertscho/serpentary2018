import * as React from 'react'
import { Seq } from 'immutable'

import { models } from '../types/models.js'
import { TournamentLink } from './TournamentLink'

export interface Props {
  tournaments: Seq.Indexed<models.Tournament>
  refreshTournaments: () => void
}

export const DashboardView = ({ tournaments, refreshTournaments }: Props) =>
  <div>
    <h1>Tournament list</h1>
    <ul>
      { tournaments.map(t => <li><TournamentLink tournament={t} /></li>) }
    </ul>
    <div>
      <span onClick={refreshTournaments}>Neu laden</span>
    </div>
  </div>
