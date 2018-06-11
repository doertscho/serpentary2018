import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector, ParametricSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map, BetsByMatchTable } from '../types/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { EXACT_POINTS, DIFFERENCE_POINTS, TENDENCY_POINTS } from '../rules'
import { ModelSelector } from '../selectors/util'

import UserIcon from '../components/UserIcon'

interface RankingTableEntry {
  position: number
  user: m.User
  score: number
  tendencies: number
  differences: number
  exacts: number
}

interface Props extends Localisable {
  matches: m.Match[]
  betsByMatch: BetsByMatchTable
  participants: m.User[]

  rankingTable: RankingTableEntry[]
}

class matchDayRankingView extends React.Component<Props, {}> {

  render() {

    let l = this.props.l
    let rankingTable = this.props.rankingTable

    return (
      <table className="rankingTable">
        <thead className="rankingHead">
          <tr>
            <td>#</td>
            <td className="userNameHead">{ l('RANKING_USER', 'User') }</td>
            <td>{ l('RANKING_TENDENCY', 'Tendency') }</td>
            <td>{ l('RANKING_DIFFERENCE', 'Difference') }</td>
            <td>{ l('RANKING_EXACT', 'Exact') }</td>
            <td>{ l('RANKING_SCORE', 'Score') }</td>
          </tr>
        </thead>
        <tbody className="rankingBody">
          { rankingTable.map(entry =>
            <tr key={entry.user.id}>
              <td className="positionCell">{entry.position}</td>
              <td className="userNameCell">
                <div className="userInfoContainer">
                  <UserIcon userId={entry.user.id}
                    userName={entry.user.preferredName} />
                  <span>{entry.user.preferredName || entry.user.id}</span>
                </div>
              </td>
              <td>{entry.tendencies}</td>
              <td>{entry.differences}</td>
              <td>{entry.exacts}</td>
              <td>{entry.score}</td>
            </tr>
          ) }
        </tbody>
      </table>
    )
  }
}

const makeGetTable = (
    getMatches: ModelSelector<m.Match[]>,
    getParticipants: ModelSelector<m.User[]>,
    getBetsByMatch: ModelSelector<BetsByMatchTable>
  ) => createSelector(
    [getMatches, getParticipants, getBetsByMatch],
    (matches,       participants,    betsByMatch) => {

      if (!participants || participants.length == 0) return []

      let finishedMatches: m.Match[] = []
      for (let i = 0; i < matches.length; i++) {
        if (matches[i].matchStatus == m.MatchStatus.FINISHED) {
          finishedMatches.push(matches[i])
        }
      }

      let table: RankingTableEntry[] = []
      for (let i = 0; i < participants.length; i++) {

        let user = participants[i]
        let entry: RankingTableEntry = {
          position: 0,
          user: user,
          score: 0,
          tendencies: 0,
          differences: 0,
          exacts: 0
        }

        for (let j = 0; j < finishedMatches.length; j++) {
          let match = finishedMatches[j]
          let bet = betsByMatch[match.id][i]

          if (skipBet(bet)) continue

          if (isExact(bet, match)) {
            entry.exacts++
            entry.score += EXACT_POINTS
          } else if (isCorrectDifference(bet, match)) {
            entry.differences++
            entry.score += DIFFERENCE_POINTS
          } else if (isCorrectTendency(bet, match)) {
            entry.tendencies++
            entry.score += TENDENCY_POINTS
          }
        }
        table.push(entry)
      }

      table.sort((a, b) => b.score - a.score)
      let lastScore = table[0].score
      table[0].position = 1
      for (let i = 1; i < table.length; i++) {
        if (table[i].score < lastScore) {
          table[i].position = i + 1
          lastScore = table[i].score
        } else {
          table[i].position = table[i-1].position
        }
      }

      return table
    }
  )

const skipBet = (bet: m.Bet) =>
  !bet || bet.status == m.BetStatus.HIDDEN || bet.status == m.BetStatus.MISSING

const isExact = (bet: m.Bet, match: m.Match) =>
  bet.homeGoals == match.homeGoals && bet.awayGoals == match.awayGoals

const isCorrectDifference = (bet: m.Bet, match: m.Match) =>
  ((bet.homeGoals - bet.awayGoals) == (match.homeGoals - match.homeGoals)) &&
  (match.homeGoals != match.awayGoals)

const isCorrectTendency = (bet: m.Bet, match: m.Match) =>
  (bet.homeGoals < bet.awayGoals && match.homeGoals < match.awayGoals) ||
  (bet.homeGoals > bet.awayGoals && match.homeGoals > match.awayGoals) ||
  (bet.homeGoals == bet.awayGoals && match.homeGoals == match.awayGoals)

const makeMapStateToProps = () => {
  let getMatches = (state: StoreState, props: any) => props.matches
  let getParticipants = (state: StoreState, props: any) => props.participants
  let getBetsByMatch = (state: StoreState, props: any) => props.betsByMatch

  let getTable = makeGetTable(getMatches, getParticipants, getBetsByMatch)

  return withLocaliser((state: StoreState, props: any) => {
    return {
      rankingTable: getTable(state, props)
    }
  })
}
export default connect(makeMapStateToProps)(matchDayRankingView)