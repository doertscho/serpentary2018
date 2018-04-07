import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { models } from '../types/models.js'
import { TournamentView } from '../components/TournamentView'
import { Action } from '../actions'
import { makeGetNumberUrlParameter } from '../selectors/util'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

const getIdFromUrl = makeGetNumberUrlParameter('id')

const makeMapStateToProps = () => {
  const getTournament = makeGetTournament(getIdFromUrl)
  const getMatchDays = makeGetMatchDays(getIdFromUrl)
  return (state: StoreState, props: any) => {
    console.log("state: ", state);
    return {
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props)
    }
  }
}

export const Tournament = connect(makeMapStateToProps)(TournamentView)
