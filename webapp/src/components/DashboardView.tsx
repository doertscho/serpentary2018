import * as React from 'react'

import { models as m } from '../types/models'
import TournamentLink from './TournamentLink'

interface Props {
  tournaments: m.Tournament[]
  refreshTournaments: () => void
}

export default ({ tournaments, refreshTournaments }: Props) => {
  console.log("DashboardView re-rendering")
  return (
    <div>
      <h1>Tournament list</h1>
      <ul>
        { tournaments.map(t => <li><TournamentLink tournament={t} /></li>) }
      </ul>
      <div>
        <span onClick={refreshTournaments}>Neu laden</span>
      </div>
    </div>
  )
}
