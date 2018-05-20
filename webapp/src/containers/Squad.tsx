import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { fetchSquad, Callbacks, joinSquad } from '../actions/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { getUserId } from '../selectors/session'
import { makeGetSquad } from '../selectors/Squad'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {
  squadId: string
  squad: m.Squad
  tournaments: m.Tournament[]
  userId: string
  fetchSquad: (squadId: string, callbacks?: Callbacks) => void
  joinSquad: (squadId: string) => void
}

const notLoggedInBox = (l: Localiser) =>
  <div>
    { l('LOG_IN_TO_JOIN', 'You need to sign up in order to join a squad') }
  </div>

const clickToJoinBox = (l: Localiser, onClick: () => void) =>
  <div onClick={onClick}>
    { l('CLICK_TO_JOIN', 'Click here to join this squad') }
  </div>

const alreadyMemberBox = (l: Localiser) =>
  <div>
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
    let tournaments = this.props.tournaments
    return (!tournaments || !tournaments.length)
  }

  requestData() {
    this.props.fetchSquad(this.props.squadId, this.requestDataCallbacks)
  }

  renderWithData() {
    let squad = this.props.squad
    let userId = this.props.userId
    let joinSquad = this.props.joinSquad
    let tournaments = this.props.tournaments || []
    let l = this.props.l
    return (
      <div>
        <h1>{ l('SQUAD_PAGE_TITLE', 'Squad details') }</h1>
        <h2>#{squad.id}</h2>
        { squadUserBox(squad, userId, joinSquad, l) }
        <h3>{ l('SQUAD_POOLS', 'Pools by this squad') }</h3>
        <ul>
          { tournaments.map(tournament =>
            <li key={tournament.id}>
              #{tournament.id}
            </li>
          )}
        </ul>
        { this.refreshComponent }
      </div>
    )
  }
}

const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  let getSquad = makeGetSquad(getSquadIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      squad: getSquad(state, props),
      tournaments: [],
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
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(squadPage)
