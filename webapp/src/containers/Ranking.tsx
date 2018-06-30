import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map } from '../types/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { makeGetPool, makeGetParticipants } from '../selectors/Pool'
import { makeGetMatchDay } from '../selectors/MatchDay'
import { makeGetRankingTable } from '../selectors/Ranking'
import { getUserId } from '../selectors/session'
import { makeGetUrlParameter } from '../selectors/util'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import { fetchRanking } from '../actions/data'
import { setCurrentSquadId } from '../actions/session'

import { LazyLoadingComponent } from './LazyLoadingComponent'
import UserIcon from '../components/UserIcon'

interface Props extends Localisable {

  squadId: string,
  tournamentId: string,
  matchDayId: string,

  matchDay: m.MatchDay
  rankingTable: m.RankingTable
  participants: m.User[]

  fetchRanking: (
      squadId: string,
      tournamentId: string,
      matchDayId: string,
      callbacks?: Callbacks
    ) => void
  updateCurrentSquadId: (squadId: string) => void
}

class rankingPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['matchDay', 'rankingTable']
  }

  shouldRefreshOnMount() {
    let participants = this.props.participants
    if (!participants || !participants.length) return true

    return false
  }

  requestData() {
    this.props.fetchRanking(
        this.props.squadId,
        this.props.tournamentId,
        this.props.matchDayId,
        this.requestDataCallbacks
    )
  }

  renderWithData() {
    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let matchDay = this.props.matchDay
    let rankingTable = this.props.rankingTable

    let participants: Map<m.User> = {}
    for (let i = 0; i < this.props.participants.length; i++) {
      let user = this.props.participants[i]
      participants[user.id] = user
    }

    let l = this.props.l

    return (
      <div>
        <h1>{ l('RANKING_PAGE_TITLE', 'Ranking') } – #{squadId}</h1>
        <table className="rankingTable">
          <thead className="rankingHead">
            <tr>
              <td>#</td>
              <td className="userNameHead">{ l('RANKING_USER', 'User') }</td>
              <td>{ l('RANKING_TENDENCY', 'Tendency') }</td>
              <td>{ l('RANKING_DIFFERENCE', 'Difference') }</td>
              <td>{ l('RANKING_EXACT', 'Exact') }</td>
              <td>{ l('RANKING_BONUS', 'Bonus points') }</td>
              <td>{ l('RANKING_SCORE', 'Total score') }</td>
            </tr>
          </thead>
          <tbody className="rankingBody">
            { rankingTable.entries.map(entry =>
              <tr key={entry.userId}>
                <td className="positionCell">{entry.position}</td>
                <td className="userNameCell">
                  <div className="userInfoContainer">
                    <UserIcon userId={entry.userId}
                        userName={participants[entry.userId].preferredName} />
                    <span>
                      { participants[entry.userId].preferredName || entry.userId }
                    </span>
                  </div>
                </td>
                <td>{entry.tendency}</td>
                <td>{entry.difference}</td>
                <td>{entry.exact}</td>
                <td>{entry.bonusPoints}</td>
                <td>{entry.score}</td>
              </tr>
            ) }
          </tbody>
        </table>
        { this.refreshComponent }
      </div>
    )
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
  let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
  let getParticipants = makeGetParticipants(getPool)
  let getRankingTable = makeGetRankingTable(
      getTournamentIdFromUrl, getMatchDayIdFromUrl, getSquadIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      matchDayId: getMatchDayIdFromUrl(state, props),
      matchDay: getMatchDay(state, props),
      pool: getPool(state, props),
      participants: getParticipants(state, props),
      rankingTable: getRankingTable(state, props)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchRanking: (
        squadId: string,
        tournamentId: string,
        matchDayId: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchRanking(
              squadId, tournamentId, matchDayId, callbacks))
      },
    updateCurrentSquadId: (squadId: string) => {
      dispatch(setCurrentSquadId(squadId))
    }
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(rankingPage)
