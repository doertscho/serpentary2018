import * as React from 'react'

import { models as m } from '../types/models'
import Match from './Match'

interface Props {
  matches: m.Match[]
}

export default ({ matches }: Props) =>
  <div>
    <h1>Match list</h1>
    <ul>
      { matches.map(match => <Match match={match} />) }
    </ul>
  </div>
