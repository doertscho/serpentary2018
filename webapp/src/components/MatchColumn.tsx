import * as React from 'react'

import { models as m } from '../types/models'
import { joinKeys } from '../types/data'

import Match from './Match'
import Bet from './Bet'

interface Props {
  match: m.Match
  bets: m.Bet[]
}

export default ({ match, bets }: Props) =>
  <div className="matchWithBets">
    <div className="match"><Match match={match} /></div>
    <div className="bets">
      { bets.map(bet =>
        <Bet key={joinKeys(match.id, bet.userName)} bet={bet} />)}
    </div>
  </div>
