import * as React from 'react'
import { Seq } from 'immutable'

import { models } from '../types/models.js'
import { MatchDayLink } from './MatchDayLink'

export interface Props {
  tournament: models.Tournament
  matchDays: Seq.Indexed<models.MatchDay>
}

export const TournamentView = ({ tournament, matchDays }: Props) => {
  console.log("got tournament:", tournament)
  console.log("got matchDays:", matchDays)
  return (
    <div>
      <h1>Match days in tournament {tournament.name}</h1>
      <ul>
        { matchDays.map(md => <MatchDayLink matchDay={md} />) }
      </ul>
    </div>
  )
}
