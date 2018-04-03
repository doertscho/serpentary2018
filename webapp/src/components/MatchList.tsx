import * as React from 'react';
import { Seq } from 'immutable'

import { models } from '../types/models.js'
import { Match } from './Match'

export interface Props {
  matches: Seq.Indexed<models.Match>
}

export const MatchList = ({ matches }: Props) =>
  <div>
    <h1>Match list</h1>
    <ul>
      { matches.map(match => <Match match={match} />) }
    </ul>
  </div>
