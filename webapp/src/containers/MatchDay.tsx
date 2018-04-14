import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { MatchDayView } from '../components/MatchDayView'
import { makeGetMatches } from '../selectors/MatchDay'

const makeMapStateToProps = () => {
  const getMatches = makeGetMatches()
  return (state: StoreState, props: any) => {
    return {
      matches: getMatches(state, props)
    }
  }
}

export const MatchDay = connect(makeMapStateToProps)(MatchDayView)
