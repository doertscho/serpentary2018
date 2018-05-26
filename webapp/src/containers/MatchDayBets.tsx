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
import {
  makeGetUrlParameter,
  makeGetNumberUrlParameter
} from '../selectors/util'
import { Action } from '../actions'
import { Callbacks, fetchBets } from '../actions/data'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import UserColumn from '../components/UserColumn'
import MatchColumn from '../components/MatchColumn'

interface Props extends Localisable {

  squadId: string,
  tournamentId: string,
  matchDayId: string,

  matchDay: m.MatchDay
  participants: m.User[]
  matches: m.Match[]
  pool: m.Pool
  betsByMatch: m.Bet[][]

  fetchBets: (
      squadId: string,
      tournamentId: string,
      matchDayId: string,
      callbacks?: Callbacks
    ) => void
}

class matchDayBetsPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
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

  renderWithData() {
    let squadId = this.props.squadId
    let matchDay = this.props.matchDay
    let pool = this.props.pool
    let betsByMatch = this.props.betsByMatch
    let participants = this.props.participants || []
    let matches = this.props.matches || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('MATCH_DAY_BETS_PAGE_TITLE', 'Match day') }</h1>
        <h2>{ l(matchDay.name) }</h2>
        <h3>{ l('MATCH_DAY_BETS_BY_SQUAD', 'As predicted by #{}', squadId) }</h3>
        <div className="betMatrix">
          <UserColumn participants={participants} />
          <div className="matches">
            { matches.map(match =>
              <MatchColumn key={match.id}
                  match={match} bets={betsByMatch[match.id]} />
            ) }
          </div>
        </div>
        { this.refreshComponent }
      </div>
    )
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
      makeGetBetsByMatch(getParticipants, getMatches, getMatchDayBetBucket)
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
      }
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(matchDayBetsPage)
