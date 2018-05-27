import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { showPopover } from '../actions/ui'
import { joinKeys } from '../types/data'
import { getUserId } from '../selectors/session'

import BetInputPopover from './BetInputPopover'
import Match from '../components/Match'

interface Props {
  match: m.Match
  bets: m.Bet[]
  userId: string
  showBetInputPopover: (match: m.Match) => void
}

const readOnlyBet = (bet: m.Bet) => {
  switch (bet.status) {
    case m.BetStatus.MISSING:
      return <div key={bet.userId} className="bet missing">-</div>
    case m.BetStatus.HIDDEN:
      return <div key={bet.userId} className="bet hidden">?</div>
    default:
      return (
        <div key={bet.userId} className="bet">
          {bet.homeGoals}:{bet.awayGoals}
        </div>
      )
  }
}

const usersBet = (
    bet: m.Bet, match: m.Match, showForm: (match: m.Match) => void) => {

  switch (bet.status) {
    case m.BetStatus.MISSING:
      return (
        <div key={bet.userId} className="bet my-bet missing"
            onClick={() => showForm(match)}>
          -
        </div>
      )
    case m.BetStatus.HIDDEN:
      return (
        <div key={bet.userId} className="bet my-bet hidden"
            onClick={() => showForm(match)}>
          ?
        </div>
      )
    default:
      return (
        <div key={bet.userId} className="bet my-bet">
          {bet.homeGoals}:{bet.awayGoals}
        </div>
      )
  }
}

class matchColumnView extends React.Component<Props, {}> {

  render() {
    let match = this.props.match
    let bets = this.props.bets
    let userId = this.props.userId
    let showBetInputPopover = this.props.showBetInputPopover
    return (
      <div className="matchWithBets">
        <div className="match"><Match match={match} /></div>
        <div className="bets">
          { bets.map(bet => {
            if (userId == bet.userId) {
              return usersBet(bet, match, showBetInputPopover)
            } else {
              return readOnlyBet(bet)
            }
          }) }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    userId: getUserId(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    showBetInputPopover: (
        match: m.Match,
        userId: string
      ) => {
        dispatch(showPopover(<BetInputPopover match={match} />))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(matchColumnView)
