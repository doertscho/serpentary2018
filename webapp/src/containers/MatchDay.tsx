import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import {
  makeGetMatchDay,
  makeGetMatches,
  makeGetTournamentId
} from '../selectors/MatchDay'
import { makeGetUserSquadsByTournament } from '../selectors/Tournament'
import { makeGetNumberUrlParameter } from '../selectors/util'

import Match from '../components/Match'

interface Props extends Localisable {
  matchDay: m.MatchDay
  matches: m.Match[]
  squads: m.Squad[]
}

const view = ({ matchDay, matches, squads, l }: Props) =>
  <div>
    <h1>{ l('MATCH_DAY_PAGE_TITLE', 'Match day') }</h1>
    <h2>#{matchDay.id}</h2>
    <h3>{ l('MATCH_DAY_MATCHES', 'Matches on this match day') }</h3>
    <ul>
      { matches.map(match => <li key={match.id}><Match match={match} /></li>) }
    </ul>
    <h3>{ l('MATCH_DAY_SQUADS', 'Bets for this match day by squad') }</h3>
    <ul>
      { squads.map(squad =>
        <li key={squad.id}>
          <Link to={matchDay.id + '/bets/' + squad.name}>{squad.name}</Link>
        </li>
      ) }
    </ul>
  </div>

const getIdFromUrl = makeGetNumberUrlParameter('id')

const makeMapStateToProps = () => {
  let getMatchDay = makeGetMatchDay(getIdFromUrl)
  let getMatches = makeGetMatches(getIdFromUrl)
  let getTournamentId = makeGetTournamentId(getMatchDay)
  let getUserSquads = makeGetUserSquadsByTournament(getTournamentId)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      matchDay: getMatchDay(state, props),
      matches: getMatches(state, props),
      squads: getUserSquads(state, props),
    }
  })
}

export default connect(makeMapStateToProps)(view)
