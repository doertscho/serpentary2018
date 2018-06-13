import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, BetsByMatchTable } from '../types/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import {
  makeGetMatchDay,
  makeGetMatches,
  makeGetSquad,
  makeGetMatchDayBetBucket,
  makeGetBetsByMatch
} from '../selectors/MatchDay'
import { makeGetTeams, makeGetTeamsById } from '../selectors/Tournament'
import { makeGetPool, makeGetParticipants } from '../selectors/Pool'
import { getUserId } from '../selectors/session'
import { makeGetUrlParameter } from '../selectors/util'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import {
  fetchBetsAsUser,
  fetchBetsAsGuest,
  postBet,
  joinPool
} from '../actions/data'
import { setCurrentSquadId } from '../actions/session'
import {
  showPopover,
  hidePopover,
  showMessage,
  hideMessage
} from '../actions/ui'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import BetInputPopover from './BetInputPopover'
import MatchDayBetBlock from './MatchDayBetBlock'
import UserColumn from '../components/UserColumn'
import MatchDayRanking from './MatchDayRanking'

interface Props extends Localisable {

  squadId: string,
  tournamentId: string,
  matchDayId: string,

  matchDay: m.MatchDay
  participants: m.User[]
  matches: m.Match[]
  squad: m.Squad
  pool: m.Pool
  betsByMatch: BetsByMatchTable
  userId: string
  teamsById: Map<m.Team>

  fetchBets: (
      isLoggedIn: boolean,
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
  joinPool: (squadId: string, tournamentId: string) => void
  showPopover: (element: React.ReactElement<any>) => void
  hidePopover: () => void
  showMessage: (message: string) => void
  hideMessage: () => void
  updateCurrentSquadId: (squadId: string) => void
}


const clickToJoinBox = (l: Localiser, onClick: () => void) =>
  <div className="headsUp note" onClick={onClick}>
    { l('CLICK_TO_JOIN_POOL', 'Click here to join this pool') }
  </div>

class matchDayBetsPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    console.log(this.props)
    return ['matchDay', 'pool', 'betsByMatch']
  }

  shouldRefreshOnMount() {
    let participants = this.props.participants
    if (!participants || !participants.length) return true
    let matches = this.props.matches
    if (!matches || !matches.length) return true
    let firstMatch = matches[0]
    let betsByMatch = this.props.betsByMatch
    if (!betsByMatch || !betsByMatch[firstMatch.id]) return true

    // if (any of) the current user's bets are marked as hidden, refresh too
    let userId = this.props.userId
    if (userId) {
      for (let i = 0; i < participants.length; i++) {
        if (participants[i].id != userId) continue
        for (let j = 0; j < matches.length; j++) {
          let match = matches[j]
          let bet = betsByMatch[match.id][i]
          if (bet && bet.status == m.BetStatus.HIDDEN) return true
        }
      }
    }

    return false
  }

  requestData() {
    let isLoggedIn = !!this.props.userId
    this.props.fetchBets(
        isLoggedIn,
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
    let showMessage = this.props.showMessage
    let hideMessage = this.props.hideMessage
    let l = this.props.l
    this.props.postBet(
      this.props.squadId,
      this.props.tournamentId,
      this.props.matchDayId,
      bet,
      {
        onSuccess: () => {
          hidePopover()
          showMessage(l('BET_STORED', 'Your bet has been saved!'))
          setTimeout(hideMessage, 3000)
        }
      }
    )
  }

  renderWithData() {
    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let matchDay = this.props.matchDay
    let squad = this.props.squad
    let pool = this.props.pool
    let betsByMatch = this.props.betsByMatch
    let participants = this.props.participants || []
    let matches = this.props.matches || []
    let userId = this.props.userId
    let teamsById = this.props.teamsById
    let joinPool = this.props.joinPool
    let l = this.props.l

    let showJoinLink =
      userId && pool && pool.participants &&
      pool.participants.indexOf(userId) === -1

    let getBets = (match: m.Match) => betsByMatch[match.id] || []

    let makeShowBetForm = (match: m.Match) =>
        (bet: m.Bet) => this.showBetForm(match, bet)

    return (
      <div>
        <h1>{ l(matchDay.name) } – #{squadId}</h1>
        { showJoinLink ?
            clickToJoinBox(l, () => joinPool(squadId, tournamentId)) :
            null }
        <div className="betMatrix">
          <UserColumn participants={participants} />
          <MatchDayBetBlock
            matchDay={matchDay} matches={matches} teamsById={teamsById}
            getBets={getBets} makeShowBetForm={makeShowBetForm} />
        </div>
        <h2>{ l('MATCH_DAY_RANKING', 'Match day ranking') }</h2>
        <MatchDayRanking matches={matches} participants={participants}
          betsByMatch={betsByMatch} />
        { this.refreshComponent }
      </div>
    )
  }

  constructor(props: Props) {
    super(props)

    this.showBetForm = this.showBetForm.bind(this)
    this.submitBet = this.submitBet.bind(this)
  }

  componentDidMount() {
    if (this.props.squadId) this.props.updateCurrentSquadId(this.props.squadId)
  }
}

const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')
const getMatchDayIdFromUrl = makeGetUrlParameter('match_day_id')
const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  let getMatchDay =
      makeGetMatchDay(getTournamentIdFromUrl, getMatchDayIdFromUrl)
  let getMatches = makeGetMatches(getMatchDay)
  let getSquad = makeGetSquad(getSquadIdFromUrl)
  let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
  let getParticipants = makeGetParticipants(getPool)
  let getMatchDayBetBucket = makeGetMatchDayBetBucket(
      getSquadIdFromUrl, getTournamentIdFromUrl, getMatchDayIdFromUrl)
  let getBetsByMatch =
      makeGetBetsByMatch(getParticipants, getMatches, getMatchDayBetBucket)
  let getTeams = makeGetTeams(getTournamentIdFromUrl)
  let getTeamsById = makeGetTeamsById(getTeams)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      matchDayId: getMatchDayIdFromUrl(state, props),
      matchDay: getMatchDay(state, props),
      matches: getMatches(state, props),
      squad: getSquad(state, props),
      pool: getPool(state, props),
      participants: getParticipants(state, props),
      betsByMatch: getBetsByMatch(state, props),
      userId: getUserId(state),
      teamsById: getTeamsById(state, props),
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchBets: (
        isLoggedIn: boolean,
        squadId: string,
        tournamentId: string,
        matchDayId: string,
        callbacks?: Callbacks
      ) => {
        if (isLoggedIn)
          dispatch(fetchBetsAsUser(
              squadId, tournamentId, matchDayId, callbacks))
        else
          dispatch(fetchBetsAsGuest(
              squadId, tournamentId, matchDayId, callbacks))
      },
    showPopover: (element: React.ReactElement<any>) => {
        dispatch(showPopover(element))
      },
    hidePopover: () => { dispatch(hidePopover()) },
    showMessage: (message: string) => { dispatch(showMessage(message)) },
    hideMessage: () => { dispatch(hideMessage()) },
    postBet: (
        squadId: string,
        tournamentId: string,
        matchDayId: string,
        bet: m.Bet,
        callbacks?: Callbacks
      ) => {
        dispatch(postBet(squadId, tournamentId, matchDayId, bet, callbacks))
      },
    joinPool: (squadId: string, tournamentId: string) => {
      dispatch(joinPool(squadId, tournamentId))
    },
    updateCurrentSquadId: (squadId: string) => {
      dispatch(setCurrentSquadId(squadId))
    }
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(matchDayBetsPage)
