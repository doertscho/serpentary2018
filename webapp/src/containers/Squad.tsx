import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import { fetchSquad, joinSquad } from '../actions/data'
import { setCurrentSquadId } from '../actions/session'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { getUserId } from '../selectors/session'
import { makeGetSquad } from '../selectors/Squad'
import { makeGetPoolsBySquad } from '../selectors/Pool'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {
  squadId: string
  squad: m.Squad
  pools: m.Pool[]
  userId: string
  fetchSquad: (squadId: string, callbacks?: Callbacks) => void
  joinSquad: (squadId: string) => void
  updateCurrentSquadId: (squadId: string) => void
}

const notLoggedInBox = (l: Localiser) =>
  <div className="headsUp note">
    { l('LOG_IN_TO_JOIN', 'You need to sign up in order to join a squad') }
  </div>

const clickToJoinBox = (l: Localiser, onClick: () => void) =>
  <div className="headsUp note" onClick={onClick}>
    { l('CLICK_TO_JOIN', 'Click here to join this squad') }
  </div>

const alreadyMemberBox = (l: Localiser) =>
  <div className="headsUp success">
    { l('ALREADY_MEMBER', 'You are a member of this squad') }
  </div>

function squadUserBox(
  squad: m.Squad,
  userId: string,
  joinSquad: (squadId: string) => void,
  l: Localiser
) {
  if (!userId || !userId.length) {
    return notLoggedInBox(l)
  }
  if (!squad.members || squad.members.indexOf(userId) === -1) {
    return clickToJoinBox(l, () => joinSquad(squad.id))
  }
  return alreadyMemberBox(l)
}

class squadPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['squad']
  }

  shouldRefreshOnMount() {
    let pools = this.props.pools
    return (!pools || !pools.length)
  }

  requestData() {
    this.props.fetchSquad(this.props.squadId, this.requestDataCallbacks)
  }

  renderWithData() {
    let squadId = this.props.squadId
    let squad = this.props.squad
    let members = squad.members || []
    let userId = this.props.userId
    let joinSquad = this.props.joinSquad
    let pools = this.props.pools || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SQUAD_PAGE_TITLE', 'Squad details') }</h1>
        <h2>#{squadId}</h2>
        { squadUserBox(squad, userId, joinSquad, l) }
        <h3>{ l('SQUAD_POOLS', 'Pools by this squad') }</h3>
        <ul>
          { pools.map(pool =>
            <li key={pool.tournamentId}>
              <Link to={
                    '/tournaments/' + pool.tournamentId +
                    '/pools/' + squadId
              }>
                #{pool.tournamentId}
              </Link>
            </li>
          )}
        </ul>
        <h3>{ l('SQUAD_MEMBERS', 'Members of this squad') }</h3>
        <ul>
          { members.map(userId =>
            <li key={userId}>{userId}</li>
          )}
        </ul>
        { this.refreshComponent }
      </div>
    )
  }

  componentDidMount() {
    if (this.props.squadId) this.props.updateCurrentSquadId(this.props.squadId)
  }
}

const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  let getSquad = makeGetSquad(getSquadIdFromUrl)
  let getPoolsBySquad = makeGetPoolsBySquad(getSquadIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      squad: getSquad(state, props),
      pools: getPoolsBySquad(state, props),
      userId: getUserId(state)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchSquad: (squadId: string, callbacks?: Callbacks) => {
      dispatch(fetchSquad(squadId, callbacks))
    },
    joinSquad: (squadId: string) => {
      dispatch(joinSquad(squadId))
    },
    updateCurrentSquadId: (squadId: string) => {
      dispatch(setCurrentSquadId(squadId))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(squadPage)
