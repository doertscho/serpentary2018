import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, joinKeys } from '../types/data'
import { Callbacks } from '../actions/base'
import { Action } from '../actions'
import { postMatchData } from '../actions/data'
import {
  showPopover,
  hidePopover,
  showMessage,
  hideMessage
} from '../actions/ui'
import { Localisable, withLocaliser } from '../locales'
import { getUserId, getIsAdmin } from '../selectors/session'
import {
  secondsToTimeout,
  EXACT_POINTS, DIFFERENCE_POINTS, TENDENCY_POINTS,
  isExact, isCorrectDifference, isCorrectTendency
} from '../rules'

import Match from '../components/Match'
import MatchCountdown from '../components/MatchCountdown'
import MatchInputPopover from './MatchInputPopover'
import TeamIcon from '../components/TeamIcon'

interface Props extends Localisable {
  match: m.Match
  bets: m.Bet[]
  teamsById: Map<m.Team>
  userId: string
  showBetForm: (bet: m.Bet) => void
  showAdminOptions: boolean
  postMatchData: (updatedMatch: m.Match, callbacks?: Callbacks) => void
  showPopover: (element: React.ReactElement<any>) => void
  hidePopover: () => void
  showMessage: (message: string) => void
  hideMessage: () => void
}

interface State {
  canEnterBets: boolean
  showCountdown: boolean
}

const readOnlyBet = (bet: m.Bet, canEnterBets: boolean, match: m.Match) => {

  if (bet.status == m.BetStatus.MISSING)
    return (
      <div key={bet.userId} className="bet missing" title="Bet missing">
        <i className="fas fa-minus"></i>
      </div>
    )

  if (bet.status == m.BetStatus.HIDDEN || canEnterBets)
    return (
      <div key={bet.userId} className="bet hidden" title="Hidden bet">
        <i className="fas fa-user-secret"></i>
      </div>
    )

  return (
    <div key={bet.userId} className={'bet ' + betClass(bet, match)}>
      {bet.homeGoals}{' : '}{bet.awayGoals}
    </div>
  )
}

const usersBet = (
  bet: m.Bet,
  showForm: (bet: m.Bet) => void,
  canEnterBets: boolean,
  match: m.Match
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
        <div key={bet.userId} className={'bet my-bet ' + betClass(bet, match)}>
          {bet.homeGoals}{' : '}{bet.awayGoals}
        </div>
      )
    }
  }
}

const betClass = (bet: m.Bet, match: m.Match) => {
  if (isExact(bet, match)) return 'exact'
  if (isCorrectDifference(bet, match)) return 'difference'
  if (isCorrectTendency(bet, match)) return 'tendency'
  return 'blank'
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

    let showMatchUpdateForm = this.props.showAdminOptions ?
      this.showMatchUpdateForm : null

    return (
      <div className="matchWithBets">
        <div className="match" onClick={showMatchUpdateForm}>
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
              return usersBet(bet, showBetForm, canEnterBets, match)
            } else {
              return readOnlyBet(bet, canEnterBets, match)
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

  showMatchUpdateForm() {
    console.log('showMatchUpdateForm', this)
    let doSubmit = this.submitMatchData
    let submit = (updatedMatch: m.Match) => { doSubmit(updatedMatch) }
    this.props.showPopover(
      <MatchInputPopover postMatchData={submit} match={this.props.match} />
    )
  }

  submitMatchData(match: m.Match) {
    let hidePopover = this.props.hidePopover
    let showMessage = this.props.showMessage
    let hideMessage = this.props.hideMessage
    let l = this.props.l
    this.props.postMatchData(
      match,
      {
        onSuccess: () => {
          hidePopover()
          showMessage(l('MATCH_DATA_STORED', 'Match data has been updated!'))
          setTimeout(hideMessage, 3000)
        }
      }
    )
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

    this.showMatchUpdateForm = this.showMatchUpdateForm.bind(this)
    this.submitMatchData = this.submitMatchData.bind(this)

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
    userId: getUserId(state),
    showAdminOptions: getIsAdmin(state),
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    showPopover: (element: React.ReactElement<any>) => {
        dispatch(showPopover(element))
      },
    hidePopover: () => { dispatch(hidePopover()) },
    showMessage: (message: string) => { dispatch(showMessage(message)) },
    hideMessage: () => { dispatch(hideMessage()) },
    postMatchData: (
        match: m.Match,
        callbacks?: Callbacks
      ) => {
        dispatch(postMatchData(match, callbacks))
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(matchColumnView)
