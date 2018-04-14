import * as React from 'react'
import { Seq } from 'immutable'

import { imodels } from '../types/imodels'
import { TournamentLink } from './TournamentLink'

export interface Props {
  tournaments: Seq.Indexed<imodels.Tournament>
  refreshTournaments: () => void
}

export const DashboardView = ({ tournaments, refreshTournaments }: Props) => {
  console.log("DashboardView re-rendering")
  return (<div>
    <h1>Tournament list</h1>
    <ul>
      { tournaments.map(t => <li><TournamentLink tournament={t} /></li>) }
    </ul>
    <div>
      <span onClick={refreshTournaments}>Neu laden</span>
    </div>
  </div>)
}
