import * as React from 'react'
import { Seq } from 'immutable'

import { models } from '../types/models.js'
import { MatchDayLink } from './MatchDayLink'

export interface Props {
  tournament: models.Tournament
  matchDays: Seq.Indexed<models.MatchDay>
  refreshTournament: (id: number) => void
}

export const TournamentView = ({
    tournament, matchDays, refreshTournament
  }: Props) => {
  console.log("got tournament:", tournament)
  console.log("got matchDays:", matchDays)
  return (
    <div>
      <h1>Match days in tournament {tournament.name}</h1>
      <ul>
        { matchDays.map(md => <li><MatchDayLink matchDay={md} /></li>) }
      </ul>
      <div>
        <span onClick={() => refreshTournament(tournament.id)}>Neu laden</span>
      </div>
    </div>
  )
}
