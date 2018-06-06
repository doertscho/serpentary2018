import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, joinKeys } from '../types/data'
import { Action } from '../actions'
import { showPopover } from '../actions/ui'
import { Localisable, withLocaliser } from '../locales'
import { getUserId } from '../selectors/session'
import { secondsToTimeout } from '../rules'

import Match from '../components/Match'
import MatchCountdown from '../components/MatchCountdown'
import TeamIcon from '../components/TeamIcon'

interface Props extends Localisable {
  match: m.Match
  bets: m.Bet[]
  teamsById: Map<m.Team>
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
      return (
        <div key={bet.userId} className="bet missing" title="Bet missing">
          <i className="fas fa-minus"></i>
        </div>
      )
    case m.BetStatus.HIDDEN:
      return (
        <div key={bet.userId} className="bet hidden" title="Hidden bet">
          <i className="fas fa-user-secret"></i>
        </div>
      )
    default:
      return (
        <div key={bet.userId} className="bet">
          {bet.homeGoals}{' : '}{bet.awayGoals}
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
        <div key={bet.userId} className="bet my-bet missing enter-now"
            onClick={() => showForm(bet)}>
          <i className="fas fa-edit"></i>
        </div>
      )
    } else {
      return (
        <div key={bet.userId} className="bet my-bet hidden enter-now"
            onClick={() => showForm(bet)}>
          <i className="fas fa-edit"></i>
        </div>
      )
    }
  } else {
    if (bet.status == m.BetStatus.MISSING) {
      return <div key={bet.userId} className="bet my-bet missing">–</div>
    } else {
      return (
        <div key={bet.userId} className="bet my-bet">
          {bet.homeGoals}{' : '}{bet.awayGoals}
        </div>
      )
    }
  }
}

class matchColumnView extends React.Component<Props, State> {

  render() {
    let match = this.props.match
    let bets = this.props.bets
    let userId = this.props.userId
    let showBetForm = this.props.showBetForm
    let canEnterBets = this.state.canEnterBets
    let inProgress = match.matchStatus == m.MatchStatus.IN_PROGRESS

    let l = this.props.l
    let homeTeamName = match.homeTeamId
    if (this.props.teamsById[match.homeTeamId])
      homeTeamName = l(this.props.teamsById[match.homeTeamId].name)
    let awayTeamName = match.awayTeamId
    if (this.props.teamsById[match.awayTeamId])
      awayTeamName = l(this.props.teamsById[match.awayTeamId].name)

    return (
      <div className="matchWithBets">
        <div className="match">
          <TeamIcon teamId={match.homeTeamId} teamName={homeTeamName} />
          <TeamIcon teamId={match.awayTeamId} teamName={awayTeamName} />
        </div>
        <div className={'matchResult' + (inProgress ? ' inProgress' : '')}>
          { this.buildMatchResult() }
          { this.buildCountdownComponent() }
        </div>
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

  buildCountdownComponent() {
    if (this.state.showCountdown) {
      console.log("Will show countdown!")
      return <MatchCountdown match={this.props.match} />
    } else {
      return null
    }
  }

  buildMatchResult() {
    let match = this.props.match
    if (match.matchStatus == m.MatchStatus.NOT_STARTED)
      return '- : -'
    let homeGoals = match.homeGoals || 0
    let awayGoals = match.awayGoals || 0
    return '' + homeGoals + ' : ' + awayGoals
  }

  constructor(props: Props) {
    super(props)

    this.showCountdown = this.showCountdown.bind(this)
    this.closeBetCounter = this.closeBetCounter.bind(this)
    this.buildCountdownComponent = this.buildCountdownComponent.bind(this)
    this.buildMatchResult = this.buildMatchResult.bind(this)

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

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    userId: getUserId(state)
  }
})

export default connect(mapStateToProps)(matchColumnView)
