import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { TournamentView } from '../components/TournamentView'
import { Action, fetchTournament } from '../actions'
import { makeGetNumberUrlParameter } from '../selectors/util'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

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

export const Tournament =
  connect(makeMapStateToProps, mapDispatchToProps)(TournamentView)
