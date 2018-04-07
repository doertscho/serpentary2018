import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { models } from '../types/models.js'
import { MatchDayView } from '../components/MatchDayView'
import { Action } from '../actions'
import { makeGetMatches } from '../selectors/MatchDay'

const makeMapStateToProps = () => {
  const getMatches = makeGetMatches()
  return (state: StoreState, props: any) => {
    console.log("state: ", state);
    return {
      matches: getMatches(state, props)
    }
  }
}

export const MatchDay = connect(makeMapStateToProps)(MatchDayView)
