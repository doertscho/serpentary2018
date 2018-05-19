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
  matchDayId: number,
  squadName: string,
  matchDay: m.MatchDay
  squad: m.Squad
  participants: m.User[]
  matches: m.Match[]
  pool: m.Pool
  betsByMatch: m.Bet[][]
  fetchBets:
    (matchDayId: number, squadName: string, callbacks?: Callbacks) => void
}

class matchDayBetsPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['matchDay', 'squad', 'pool', 'betsByMatch']
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
        this.props.matchDayId, this.props.squadName, this.requestDataCallbacks)
  }

  renderWithData() {
    let matchDay = this.props.matchDay
    let squad = this.props.squad
    let pool = this.props.pool
    let betsByMatch = this.props.betsByMatch
    let participants = this.props.participants || []
    let matches = this.props.matches || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('MATCH_DAY_BETS_PAGE_TITLE', 'Match day') }</h1>
        <h2>#{matchDay.id}</h2>
        <h3>{ l('MATCH_DAY_BETS_BY_SQUAD', 'As predicted by #{}', squad.id) }</h3>
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

const getMatchDayIdFromUrl = makeGetNumberUrlParameter('id')
const getSquadNameFromUrl = makeGetUrlParameter('squad')

const makeMapStateToProps = () => {
  let getMatchDay = makeGetMatchDay(getMatchDayIdFromUrl)
  let getMatches = makeGetMatches(getMatchDayIdFromUrl)
  let getSquad = makeGetSquad(getSquadNameFromUrl)
  let getPool = makeGetPool(getMatchDay, getSquad)
  let getParticipants = makeGetParticipants(getPool)
  let getMatchDayBetBucket = makeGetMatchDayBetBucket(getMatchDay, getSquad)
  let getBetsByMatch =
      makeGetBetsByMatch(getParticipants, getMatches, getMatchDayBetBucket)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      matchDayId: getMatchDayIdFromUrl(state, props),
      squadName: getSquadNameFromUrl(state, props),
      matchDay: getMatchDay(state, props),
      squad: getSquad(state, props),
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
        matchDayId: number,
        squadName: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchBets(matchDayId, squadName, callbacks))
      }
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(matchDayBetsPage)
