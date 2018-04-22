import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { makeGetMatches } from '../selectors/MatchDay'

import view from '../components/MatchDayView'

const makeMapStateToProps = () => {
  const getMatches = makeGetMatches()
  return (state: StoreState, props: any) => {
    return {
      matches: getMatches(state, props)
    }
  }
}

export default connect(makeMapStateToProps)(view)
