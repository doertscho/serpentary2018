import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchPool, Callbacks, joinPool } from '../actions/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { getUserId } from '../selectors/session'
import { makeGetPool } from '../selectors/Pool'
import { makeGetTournament } from '../selectors/Tournament'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {
  squadId: string
  tournamentId: string
  pool: m.Pool
  tournament: m.Tournament
  userId: string
  fetchPool: (
    squadId: string, tournamentId: string, callbacks?: Callbacks) => void
  joinPool: (squadId: string, tournamentId: string) => void
}

const notLoggedInBox = (l: Localiser) =>
  <div>
    { l('LOG_IN_TO_JOIN_POOL', 'You need to sign up in order to join a pool') }
  </div>

const clickToJoinBox = (l: Localiser, onClick: () => void) =>
  <div onClick={onClick}>
    { l('CLICK_TO_JOIN_POOL', 'Click here to join this pool') }
  </div>

const alreadyMemberBox = (l: Localiser) =>
  <div>
    { l('ALREADY_PARTICIPANT_POOL', 'You are participating in this pool') }
  </div>

function poolUserBox(
  pool: m.Pool,
  userId: string,
  joinPool: (squadId: string, tournamentId: string) => void,
  l: Localiser
) {
  if (!userId || !userId.length) {
    return notLoggedInBox(l)
  }
  if (!pool.participants || pool.participants.indexOf(userId) === -1) {
    return clickToJoinBox(l, () => joinPool(pool.squadId, pool.tournamentId))
  }
  return alreadyMemberBox(l)
}

class poolPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['pool']
  }

  shouldRefreshOnMount() {
    let tournament = this.props.tournament
    return !tournament
  }

  requestData() {
    this.props.fetchPool(
        this.props.squadId, this.props.tournamentId, this.requestDataCallbacks)
  }

  renderWithData() {
    let pool = this.props.pool
    let userId = this.props.userId
    let joinPool = this.props.joinPool
    let squadId = this.props.squadId
    let tournamentName: string | m.ILocalisableString = this.props.tournamentId
    if (this.props.tournament && this.props.tournament.name) {
      tournamentName = this.props.tournament.name
    }
    let participants = pool.participants || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('POOL_PAGE_TITLE', 'Pool details') }</h1>
        <h2>{ l(tournamentName) }, by #{squadId}</h2>
        { poolUserBox(pool, userId, joinPool, l) }
        <h3>{ l('POOL_PARTICIPANTS', 'Users participating in this pool') }</h3>
        <ul>
          { participants.map(userId =>
            <li key={userId}>{userId}</li>
          )}
        </ul>
        { this.refreshComponent }
      </div>
    )
  }
}

const getSquadIdFromUrl = makeGetUrlParameter('squad_id')
const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')

const makeMapStateToProps = () => {
  let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
  let getTournament = makeGetTournament(getTournamentIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      pool: getPool(state, props),
      tournament: getTournament(state, props),
      userId: getUserId(state)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchPool: (
        squadId: string,
        tournamentId: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchPool(squadId, tournamentId, callbacks))
      },
    joinPool: (squadId: string, tournamentId: string) => {
      dispatch(joinPool(squadId, tournamentId))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(poolPage)
