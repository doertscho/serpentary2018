import * as React from 'react';

import { models } from '../types/models.js'

import { Match } from './Match'

export interface Props {
  matches: models.Match[]
}

export const MatchList = (props: Props) =>
  <div>
    <h1>Match list</h1>
    <ul>
      { props.matches.map(match => <Match match={match} />) }
    </ul>
  </div>
