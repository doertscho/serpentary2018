import * as React from 'react'
import { connect } from 'react-redux'
import { createSelector, ParametricSelector } from 'reselect'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Map } from '../types/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { ModelSelector } from '../selectors/util'

import MatchColumn from './MatchColumn'

interface InfoBlock {
  text: string
  colspan: number
  seq: number
}

interface Props extends Localisable {
  matchDay: m.MatchDay
  matches: m.Match[]
  teamsById: Map<m.Team>
  getBets: (match: m.Match) => m.Bet[]
  makeShowBetForm: (match: m.Match) => (bet: m.Bet) => void

  stageBlocks: InfoBlock[]
  dateBlocks: InfoBlock[]
  timeBlocks: InfoBlock[]
}

class matchDayBetBlockView extends React.Component<Props, {}> {

  render() {
    let matches = this.props.matches
    let getBets = this.props.getBets
    let teamsById = this.props.teamsById
    let makeShowBetForm = this.props.makeShowBetForm
    let stageBlocks = this.props.stageBlocks
    let dateBlocks = this.props.dateBlocks
    let timeBlocks = this.props.timeBlocks

    return (
      <div className="matchDayBlock">
        <div className="matchInfo">
          <div className="infoLine">{ buildBlocks(stageBlocks) }</div>
          <div className="infoLine">{ buildBlocks(dateBlocks) }</div>
          <div className="infoLine">{ buildBlocks(timeBlocks) }</div>
        </div>
        <div className="matches">
          { matches.map(match =>
            <MatchColumn key={match.id}
              match={match} teamsById={teamsById} bets={getBets(match)}
              showBetForm={makeShowBetForm(match)} />
          ) }
        </div>
      </div>
    )
  }
}

const cellWidth = 100
const cellMargin = 4

const buildBlocks = (blocks: InfoBlock[]) => blocks.map(block => {
  let width = (cellWidth * block.colspan) + (cellMargin * (block.colspan - 1))
  let style = { width: '' + width + 'px' }
  return (
    <div key={block.seq} className="infoBlock" style={style}>
      { block.text }
    </div>
  )
})

const makeBlocksSelector = (textFunc: (m: m.Match, l: Localiser) => string) => (
    getMatches: ModelSelector<m.Match[]>,
    getLocaliser: ModelSelector<Localiser>
  ) => createSelector(
    [getMatches, getLocaliser],
    (matches,       localiser) => {
      if (!matches || matches.length == 0) return []
      let result: InfoBlock[] = []
      let current =
          { text: textFunc(matches[0], localiser), colspan: 1, seq: 0 }
      for (let i = 1; i < matches.length; i++) {
        let newText = textFunc(matches[i], localiser)
        if (current.text == newText) {
          current.colspan = current.colspan + 1
        } else {
          result.push(current)
          current = { text: newText, colspan: 1, seq: i }
        }
      }
      result.push(current)
      return result
    }
  )

const makeGetStageBlocks = (matchDay: m.MatchDay) => makeBlocksSelector(
    (match: m.Match, l: Localiser) => {
      let t = match.matchType
      if (t == m.MatchType.NORMAL) return l(matchDay.name)
      let typeString: string = m.MatchType[t]
      return l(typeString)
    })
const makeGetDateBlocks = makeBlocksSelector(
    (m: m.Match, l: Localiser) => l(m.kickOff, 'date'))
const makeGetTimeBlocks = makeBlocksSelector(
    (m: m.Match, l: Localiser) => l(m.kickOff, 'time'))

const makeMapStateToProps = () => {
  let getMatches = (state: StoreState, props: any) => props.matches
  let getLocaliser = (state: StoreState, props: any) => props.l
  let getDateBlocks = makeGetDateBlocks(getMatches, getLocaliser)
  let getTimeBlocks = makeGetTimeBlocks(getMatches, getLocaliser)
  return withLocaliser((state: StoreState, props: any) => {
    let getStageBlocks =
        makeGetStageBlocks(props.matchDay)(getMatches, getLocaliser)
    return {
      stageBlocks: getStageBlocks(state, props),
      dateBlocks: getDateBlocks(state, props),
      timeBlocks: getTimeBlocks(state, props),
    }
  })
}
export default connect(makeMapStateToProps)(matchDayBetBlockView)
