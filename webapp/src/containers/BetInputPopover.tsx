import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { Callbacks, postBet } from '../actions/data'
import { hidePopover } from '../actions/ui'
import { getUserId } from '../selectors/session'

import Match from '../components/Match'

interface Props extends Localisable {
  match: m.Match
  bet: m.Bet
  userId: string
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
    let homeGoals = this.state.homeGoals
    let awayGoals = this.state.awayGoals
    let l = this.props.l
    return (
      <div className="betInput">
        <div className="match"><Match match={match} /></div>
        <div className="userId">{ userId }</div>
        <div className="goalInputs">
          <div className="goalInput">
            <div onClick={this.incHomeGoals}>
              <i className="fas fa-chevron-up"></i>
            </div>
            <div className="goalCount">{ homeGoals}</div>
            <div onClick={this.decHomeGoals}>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
          <div className="goalSeparator">:</div>
          <div className="goalInput">
            <div onClick={this.incAwayGoals}>
              <i className="fas fa-chevron-up"></i>
            </div>
            <div className="goalCount">{ awayGoals}</div>
            <div onClick={this.decAwayGoals}>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>
        <div>
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

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    userId: getUserId(state)
  }
})

export default connect(mapStateToProps)(betInputView)
