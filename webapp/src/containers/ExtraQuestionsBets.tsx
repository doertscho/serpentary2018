import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { makeGetPool, makeGetParticipants } from '../selectors/Pool'
import { getUserId } from '../selectors/session'
import { makeGetUrlParameter } from '../selectors/util'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {

  squadId: string
  tournamentId: string
}

class extraBetsPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps(): string[] {
    return []
  }

  shouldRefreshOnMount() {
    return false
  }

  requestData() {
  }

  renderWithData() {
    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let l = this.props.l

    return (
      <div>
        <h1>{ l('EXTRA_QUESTIONS_BETS_PAGE_TITLE', 'Extra question bets') }</h1>
        <h2>{tournamentId} – #{squadId}</h2>
        <p>(sorry, this is not yet available.)</p>
        { this.refreshComponent }
      </div>
    )
  }
}

const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')
const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(extraBetsPage)
