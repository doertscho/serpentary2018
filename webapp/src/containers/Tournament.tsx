import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { models as m } from '../types/models'
import { Localisable, withLocaliser } from '../locales'
import { fetchTournament } from '../actions/data'
import { makeGetNumberUrlParameter } from '../selectors/util'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

import MatchDayLink from '../components/MatchDayLink'

interface Props extends Localisable {
  tournament: m.Tournament
  matchDays: m.MatchDay[]
  refreshTournament: (id: number) => void
}

const view = ({ tournament, matchDays, refreshTournament, l }: Props) => {
  console.log('Tournament rendering')
  return (
    <div>
      <h1>{ l('TOURNAMENT_PAGE_TITLE', 'Tournament details') }</h1>
      <h2>{ l(tournament.name) }</h2>
      <h3>{ l('TOURNAMENT_MATCH_DAYS', 'Match days in this tournament') }</h3>
      <ul>
        { matchDays.map(matchDay =>
          <li key={matchDay.id}><MatchDayLink matchDay={matchDay} /></li>) }
      </ul>
      <div>
        <span onClick={() => refreshTournament(tournament.id)}>
          { l('REFRESH', 'Refresh') }
        </span>
      </div>
    </div>
  )
}

const getIdFromUrl = makeGetNumberUrlParameter('id')

const makeMapStateToProps = () => {
  let getTournament = makeGetTournament(getIdFromUrl)
  let getMatchDays = makeGetMatchDays(getIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    refreshTournament: (id: number) => {
      dispatch(fetchTournament(id))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(view)
