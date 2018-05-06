import * as React from 'react'

import { models as m } from '../types/models'

interface Props {
  bet: m.Bet
}

export default ({ bet }: Props) => {
  switch (bet.status) {
    case m.BetStatus.MISSING:
      return <div className="bet missing">-</div>
    case m.BetStatus.HIDDEN:
      return <div className="bet hidden">?</div>
    default:
      return <div className="bet">{bet.homeGoals}:{bet.awayGoals}</div>
  }
}
