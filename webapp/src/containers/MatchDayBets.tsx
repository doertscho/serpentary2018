import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

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
import { models as m } from '../types/models'

import UserColumn from '../components/UserColumn'
import MatchColumn from '../components/MatchColumn'

interface Props extends Localisable {
  matchDay: m.MatchDay
  squad: m.Squad
  participants: m.User[]
  matches: m.Match[]
  pool: m.Pool
  betsByMatch: m.Bet[][]
}

const view = ({
  matchDay, squad, participants, matches, pool, betsByMatch, l
}: Props) =>
  <div>
    <h1>{ l('MATCH_DAY_BETS_PAGE_TITLE', 'Match day') }</h1>
    <h2>#{matchDay.id}</h2>
    <h3>{ l('MATCH_DAY_BETS_BY_SQUAD', 'As predicted by #{}', squad.name) }</h3>
    <div className="betMatrix">
      <UserColumn participants={participants} />
      <div className="matches">
        { matches.map(match =>
          <MatchColumn key={match.id}
              match={match} bets={betsByMatch[match.id]} />
        ) }
      </div>
    </div>
  </div>

const getMatchDayIdFromUrl = makeGetNumberUrlParameter('id')
const getSquadNameFromUrl = makeGetUrlParameter('squad')

const makeMapStateToProps = () => {
  let getMatchDay = makeGetMatchDay(getMatchDayIdFromUrl)
  let getMatches = makeGetMatches(getMatchDayIdFromUrl)
  let getSquad = makeGetSquad(getSquadNameFromUrl)
  let getPool = makeGetPool(getMatchDay, getSquad)
  let getParticipants = makeGetParticipants(getPool)
  let getMatchDayBetBucket = makeGetMatchDayBetBucket(getMatchDay, getPool)
  let getBetsByMatch =
      makeGetBetsByMatch(getParticipants, getMatches, getMatchDayBetBucket)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      matchDay: getMatchDay(state, props),
      squad: getSquad(state, props),
      matches: getMatches(state, props),
      pool: getPool(state, props),
      participants: getParticipants(state, props),
      betsByMatch: getBetsByMatch(state, props),
    }
  })
}

export default connect(makeMapStateToProps)(view)
