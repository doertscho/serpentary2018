import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { Callbacks, postBet } from '../actions/data'
import { hidePopover } from '../actions/ui'
import { getUserId } from '../selectors/session'
import { getTeams } from '../selectors/data'

import Match from '../components/Match'

interface Props extends Localisable {
  match: m.Match
  bet: m.Bet
  userId: string
  homeTeam: m.Team
  awayTeam: m.Team
  postBet: (bet: m.Bet) => void
}

interface State {
  homeGoals: number
  awayGoals: number
}

class betInputView extends React.Component<Props, State> {

  render() {
    let match = this.props.match
    let userId = this.props.userId
    let homeTeam = this.props.homeTeam
    let awayTeam = this.props.awayTeam
    let homeGoals = this.state.homeGoals
    let awayGoals = this.state.awayGoals
    let l = this.props.l
    return (
      <div className="betInput">
        <div className="matchTeams">
          <div className="teamName">{ l(homeTeam.name) }</div>
          <div>- vs. -</div>
          <div className="teamName">{ l(awayTeam.name) }</div>
        </div>
        <div className="matchInfo">
          <div>{ l('KICK_OFF', 'Kick off') }:</div>
          <div className="kickOffTime">
            { l(match.kickOff, 'date-and-time') }
          </div>
        </div>
        <div className="goalInputs">
          <div className="goalInput">
            <div className="control" onClick={this.incHomeGoals}>
              <i className="fas fa-chevron-up"></i>
            </div>
            <div className="goalCount">{ homeGoals}</div>
            <div className="control" onClick={this.decHomeGoals}>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <div className="goalSeparator">:</div>
          <div className="goalInput">
            <div className="control" onClick={this.incAwayGoals}>
              <i className="fas fa-chevron-up"></i>
            </div>
            <div className="goalCount">{ awayGoals}</div>
            <div className="control" onClick={this.decAwayGoals}>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        <div className="submitArea">
          <button onClick={this.submitBet}>
            { l('SUBMIT_BET', 'Submit') }
          </button>
        </div>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)

    let homeGoals = 0
    let awayGoals = 0
    if (props.bet) {
      homeGoals = props.bet.homeGoals || 0
      awayGoals = props.bet.awayGoals || 0
    }
    this.state = { homeGoals: homeGoals, awayGoals: awayGoals }

    this.submitBet = this.submitBet.bind(this)
    this.incHomeGoals = this.incHomeGoals.bind(this)
    this.incAwayGoals = this.incAwayGoals.bind(this)
    this.decHomeGoals = this.decHomeGoals.bind(this)
    this.decAwayGoals = this.decAwayGoals.bind(this)
  }

  submitBet() {
    let bet = m.Bet.create({
      homeGoals: this.state.homeGoals,
      awayGoals: this.state.awayGoals
    })
    this.props.postBet(bet)
  }

  incHomeGoals() {
    this.setState({ homeGoals: this.state.homeGoals + 1 })
  }

  incAwayGoals() {
    this.setState({ awayGoals: this.state.awayGoals + 1 })
  }

  decHomeGoals() {
    if (this.state.homeGoals > 0)
      this.setState({ homeGoals: this.state.homeGoals - 1 })
  }

  decAwayGoals() {
    if (this.state.awayGoals > 0)
      this.setState({ awayGoals: this.state.awayGoals - 1 })
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  let match = props.match
  let teams = getTeams(state)
  let homeTeamKey = joinKeys(match.tournamentId, match.homeTeamId)
  let awayTeamKey = joinKeys(match.tournamentId, match.awayTeamId)
  return {
    userId: getUserId(state),
    homeTeam: teams[homeTeamKey],
    awayTeam: teams[awayTeamKey]
  }
})

export default connect(mapStateToProps)(betInputView)
