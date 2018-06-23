import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { joinKeys } from '../types/data'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import { postBet } from '../actions/data'
import { hidePopover } from '../actions/ui'
import { getUserId } from '../selectors/session'
import { getTeams } from '../selectors/data'

import Match from '../components/Match'
import TeamIcon from '../components/TeamIcon'

interface Props extends Localisable {
  match: m.Match
  homeTeam: m.Team
  awayTeam: m.Team
  postMatchData: (match: m.Match) => void
}

interface State {
  homeGoals: number
  awayGoals: number
  matchStatus: m.MatchStatus
}

class matchInputView extends React.Component<Props, State> {

  render() {
    let match = this.props.match
    let homeTeam = this.props.homeTeam
    let awayTeam = this.props.awayTeam
    let homeGoals = this.state.homeGoals
    let awayGoals = this.state.awayGoals
    let matchStatus = this.state.matchStatus
    let l = this.props.l
    return (
      <div className="betInput">
        <div className="teamIcons">
          <TeamIcon teamId={homeTeam.id} teamName={l(homeTeam.name)} />
          <TeamIcon teamId={awayTeam.id} teamName={l(awayTeam.name)} />
        </div>
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
        <div className="matchInfo">
          <div className="kickOffTime">
            <select value={matchStatus} onChange={this.updateMatchStatus}>
              <option value={m.MatchStatus.NOT_STARTED}>Not started</option>
              <option value={m.MatchStatus.IN_PROGRESS}>In progress</option>
              <option value={m.MatchStatus.FINISHED}>Finished</option>
            </select>
          </div>
        </div>
        <div className="submitArea">
          <button onClick={this.submitData}>
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
    let matchStatus = m.MatchStatus.NOT_STARTED
    if (props.match) {
      homeGoals = props.match.homeGoals || 0
      awayGoals = props.match.awayGoals || 0
      matchStatus = props.match.matchStatus || m.MatchStatus.NOT_STARTED
    }
    this.state = {
      homeGoals: homeGoals, awayGoals: awayGoals, matchStatus: matchStatus }

    this.submitData = this.submitData.bind(this)
    this.incHomeGoals = this.incHomeGoals.bind(this)
    this.incAwayGoals = this.incAwayGoals.bind(this)
    this.decHomeGoals = this.decHomeGoals.bind(this)
    this.decAwayGoals = this.decAwayGoals.bind(this)
    this.updateMatchStatus = this.updateMatchStatus.bind(this)
  }

  submitData() {
    let match = m.Match.create(this.props.match)
    match.homeGoals = this.state.homeGoals
    match.awayGoals = this.state.awayGoals
    match.matchStatus = this.state.matchStatus
    this.props.postMatchData(match)
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

  updateMatchStatus(e: React.ChangeEvent<HTMLSelectElement>) {
    let parsed = parseInt(e.target.value)
    this.setState({ matchStatus: parsed })
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  let match = props.match
  let teams = getTeams(state)
  let homeTeamKey = joinKeys(match.tournamentId, match.homeTeamId)
  let awayTeamKey = joinKeys(match.tournamentId, match.awayTeamId)
  return {
    homeTeam: teams[homeTeamKey],
    awayTeam: teams[awayTeamKey]
  }
})

export default connect(mapStateToProps)(matchInputView)
