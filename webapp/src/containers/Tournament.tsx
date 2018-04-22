import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchTournament } from '../actions/data'
import { makeGetNumberUrlParameter } from '../selectors/util'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

import view from '../components/TournamentView'

const getIdFromUrl = makeGetNumberUrlParameter('id')

const makeMapStateToProps = () => {
  const getTournament = makeGetTournament(getIdFromUrl)
  const getMatchDays = makeGetMatchDays(getIdFromUrl)
  return (state: StoreState, props: any) => {
    return {
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props)
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    refreshTournament: (id: number) => {
      dispatch(fetchTournament(id))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(view)
