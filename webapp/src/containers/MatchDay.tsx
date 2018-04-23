import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import { makeGetMatches } from '../selectors/MatchDay'
import { models as m } from '../types/models'

import Match from '../components/Match'

interface Props extends Localisable {
  matches: m.Match[]
}

const view = ({ matches, l }: Props) =>
  <div>
    <h1>{ l('MATCH_DAY_PAGE_TITLE', 'Match day') }</h1>
    <ul>
      { matches.map(match => <Match match={match} />) }
    </ul>
  </div>

const makeMapStateToProps = () => {
  const getMatches = makeGetMatches()
  return withLocaliser((state: StoreState, props: any) => {
    return {
      matches: getMatches(state, props)
    }
  })
}

export default connect(makeMapStateToProps)(view)
