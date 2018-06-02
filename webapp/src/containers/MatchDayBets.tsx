import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import {
  makeGetMatchDay,
  makeGetMatches,
  makeGetSquad,
  makeGetMatchDayBetBucket,
  makeGetBetsByMatch
} from '../selectors/MatchDay'
import { makeGetPool, makeGetParticipants } from '../selectors/Pool'
import { getUserId } from '../selectors/session'
import { makeGetUrlParameter } from '../selectors/util'
import { Action } from '../actions'
import { Callbacks, fetchBets, postBet } from '../actions/data'
import { showPopover, hidePopover } from '../actions/ui'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import BetInputPopover from './BetInputPopover'
import MatchColumn from './MatchColumn'
import UserColumn from '../components/UserColumn'

interface Props extends Localisable {

  squadId: string,
  tournamentId: string,
  matchDayId: string,

  matchDay: m.MatchDay
  participants: m.User[]
  matches: m.Match[]
  pool: m.Pool
  betsByMatch: m.Bet[][]
  userId: string

  fetchBets: (
      squadId: string,
      tournamentId: string,
      matchDayId: string,
      callbacks?: Callbacks
    ) => void
  postBet: (
      squadId: string,
      tournamentId: string,
      matchDayId: string,
      bet: m.Bet,
      callbacks?: Callbacks
    ) => void
  showPopover: (element: React.ReactElement<any>) => void
  hidePopover: () => void
}

class matchDayBetsPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    console.log(this.props)
    return ['matchDay', 'pool', 'betsByMatch']
  }

  shouldRefreshOnMount() {
    let participants = this.props.participants
    let matches = this.props.matches
    let betsByMatch = this.props.betsByMatch
    return (!participants || !participants.length ||
        !matches || !matches.length ||
        !betsByMatch || !betsByMatch.length)
  }

  requestData() {
    this.props.fetchBets(
        this.props.squadId,
        this.props.tournamentId,
        this.props.matchDayId,
        this.requestDataCallbacks
    )
  }

  showBetForm(match: m.Match, bet: m.Bet) {
    let submitBet = this.submitBet
    let postBet = (updatedBet: m.Bet) => { submitBet(match, updatedBet) }
    this.props.showPopover(
      <BetInputPopover postBet={postBet} bet={bet} match={match} />
    )
  }

  submitBet(match: m.Match, bet: m.Bet) {
    bet.matchId = match.id
    let hidePopover = this.props.hidePopover
    this.props.postBet(
      this.props.squadId,
      this.props.tournamentId,
      this.props.matchDayId,
      bet,
      { onSuccess: hidePopover }
    )
  }

  renderWithData() {
    let squadId = this.props.squadId
    let matchDay = this.props.matchDay
    let pool = this.props.pool
    let betsByMatch = this.props.betsByMatch
    let participants = this.props.participants || []
    let matches = this.props.matches || []
    let userId = this.props.userId
    let l = this.props.l

    let getBets = (match: m.Match) => betsByMatch[match.id] || []
    let makeShowBetForm = (match: m.Match) =>
        (bet: m.Bet) => this.showBetForm(match, bet)

    return (
      <div>
        <h1>{ l(matchDay.name) } – #{squadId}</h1>
        <div className="betMatrix">
          <UserColumn participants={participants} />
          <div className="matches">
            { matches.map(match =>
              <MatchColumn key={match.id}
                  match={match} bets={getBets(match)}
                  showBetForm={makeShowBetForm(match)} />
            ) }
          </div>
        </div>
        { this.refreshComponent }
      </div>
    )
  }

  constructor(props: Props) {
    super(props)

    this.showBetForm = this.showBetForm.bind(this)
    this.submitBet = this.submitBet.bind(this)
  }
}

const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')
const getMatchDayIdFromUrl = makeGetUrlParameter('match_day_id')
const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  let getMatchDay =
      makeGetMatchDay(getTournamentIdFromUrl, getMatchDayIdFromUrl)
  let getMatches = makeGetMatches(getMatchDay)
  let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
  let getParticipants = makeGetParticipants(getPool)
  let getMatchDayBetBucket = makeGetMatchDayBetBucket(
      getSquadIdFromUrl, getTournamentIdFromUrl, getMatchDayIdFromUrl)
  let getBetsByMatch =
      makeGetBetsByMatch(getPool, getMatches, getMatchDayBetBucket)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      matchDayId: getMatchDayIdFromUrl(state, props),
      matchDay: getMatchDay(state, props),
      matches: getMatches(state, props),
      pool: getPool(state, props),
      participants: getParticipants(state, props),
      betsByMatch: getBetsByMatch(state, props),
      userId: getUserId(state)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchBets: (
        squadId: string,
        tournamentId: string,
        matchDayId: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchBets(squadId, tournamentId, matchDayId, callbacks))
      },
    showPopover: (element: React.ReactElement<any>) => {
        dispatch(showPopover(element))
      },
    hidePopover: () => { dispatch(hidePopover()) },
    postBet: (
        squadId: string,
        tournamentId: string,
        matchDayId: string,
        bet: m.Bet,
        callbacks?: Callbacks
      ) => {
        dispatch(postBet(squadId, tournamentId, matchDayId, bet, callbacks))
      },
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(matchDayBetsPage)
