import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { Action } from '../actions'
import { getUserId } from '../selectors/session'

import Match from '../components/Match'

interface Props {
  match: m.Match
  userId: string
}

class betInputView extends React.Component<Props, {}> {

  render() {
    let match = this.props.match
    let userId = this.props.userId
    return (
      <div>
        <div className="match"><Match match={match} /></div>
        <div className="userId">{ userId }</div>
      </div>
    )
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    userId: getUserId(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(betInputView)
