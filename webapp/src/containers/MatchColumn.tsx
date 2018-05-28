import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { showPopover } from '../actions/ui'
import { joinKeys } from '../types/data'
import { getUserId } from '../selectors/session'
import { secondsToTimeout } from '../rules'

import Match from '../components/Match'
import MatchCountdown from '../components/MatchCountdown'

interface Props {
  match: m.Match
  bets: m.Bet[]
  userId: string
  showBetForm: (bet: m.Bet) => void
}

interface State {
  canEnterBets: boolean
  showCountdown: boolean
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
  bet: m.Bet,
  showForm: (bet: m.Bet) => void,
  canEnterBets: boolean
) => {

  if (canEnterBets) {
    if (bet.status == m.BetStatus.MISSING) {
      return (
        <div key={bet.userId} className="bet my-bet missing"
            onClick={() => showForm(bet)}>
          -
        </div>
      )
    } else {
      return (
        <div key={bet.userId} className="bet my-bet hidden"
            onClick={() => showForm(bet)}>
          ?
        </div>
      )
    }
  } else {
    if (bet.status == m.BetStatus.MISSING) {
      return <div key={bet.userId} className="bet my-bet missing">-</div>
    } else {
      return (
        <div key={bet.userId} className="bet my-bet">
          {bet.homeGoals}:{bet.awayGoals}
        </div>
      )
    }
  }
}

function buildCountdownComponent(showCountdown: boolean, match: m.Match) {
  if (showCountdown) {
    console.log("Will show countdown!")
    return <MatchCountdown match={match} />
  } else {
    return <div className="matchCountdown"></div>
  }
}

class matchColumnView extends React.Component<Props, State> {

  render() {
    let match = this.props.match
    let bets = this.props.bets
    let userId = this.props.userId
    let showBetForm = this.props.showBetForm
    let canEnterBets = this.state.canEnterBets
    let showCountdown = this.state.showCountdown
    return (
      <div className="matchWithBets">
        <div className="match">
          { match.homeTeamId }
          <br />
          vs.
          <br />
          { match.awayTeamId }
        </div>
        { buildCountdownComponent(showCountdown, match) }
        <div className="bets">
          { bets.map(bet => {
            if (userId == bet.userId) {
              return usersBet(bet, showBetForm, canEnterBets)
            } else {
              return readOnlyBet(bet)
            }
          }) }
        </div>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)

    this.showCountdown = this.showCountdown.bind(this)
    this.closeBetCounter = this.closeBetCounter.bind(this)

    let timeToClosure = secondsToTimeout(props.match)
    let open = timeToClosure > 0
    let showCountdown = open && timeToClosure < 3600
    this.state = { canEnterBets: open, showCountdown: showCountdown }

    if (open) {
      let self = this
      setTimeout(self.closeBetCounter, timeToClosure * 1000)

      if (!showCountdown) {
        let timeToShowCountdown = timeToClosure - 3600
        console.log("Will start showing countdown in ", timeToShowCountdown)
        setTimeout(self.showCountdown, timeToShowCountdown * 1000)
      }
    }
  }

  showCountdown() {
    console.log("Less than one hour to go, showing countdown")
    this.setState({ showCountdown: true })
  }

  closeBetCounter() {
    console.log("Closing the counter for match", this.props.match)
    this.setState({ canEnterBets: false })
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    userId: getUserId(state)
  }
}

export default connect(mapStateToProps)(matchColumnView)
