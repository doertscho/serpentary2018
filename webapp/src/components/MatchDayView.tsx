import * as React from 'react'
import { Seq } from 'immutable'

import { models } from '../types/models.js'
import { Match } from './Match'

export interface Props {
  matches: Seq.Indexed<models.Match>
}

export const MatchDayView = ({ matches }: Props) =>
  <div>
    <h1>Match list</h1>
    <ul>
      { matches.map(m => <Match match={m} />) }
    </ul>
  </div>
