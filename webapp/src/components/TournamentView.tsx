import * as React from 'react'

import { models as m } from '../types/models'
import MatchDayLink from './MatchDayLink'

interface Props {
  tournament: m.Tournament
  matchDays: m.MatchDay[]
  refreshTournament: (id: number) => void
}

export default ({ tournament, matchDays, refreshTournament }: Props) => {
  return (
    <div>
      <h1>Match days in tournament {tournament.name}</h1>
      <ul>
        { matchDays.map(matchDay =>
          <li><MatchDayLink matchDay={matchDay} /></li>) }
      </ul>
      <div>
        <span onClick={() => refreshTournament(tournament.id)}>Neu laden</span>
      </div>
    </div>
  )
}
