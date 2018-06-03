import * as React from 'react'
import { connect } from 'react-redux'

import { StoreState } from '../types'
import { hasPendingRequests } from '../selectors'

interface Props {
  hasPendingRequests: boolean
}

const view = (props: Props) => {

  if (props.hasPendingRequests)
    return (
      <div className="activityReporter">
        <i className="fas fa-sync fa-spin"></i>
      </div>
    )

  else
    return (
      <div className="activityReporter">&nbsp;</div>
    )
}

const mapStateToProps = (state: StoreState) => {
  return {
    hasPendingRequests: hasPendingRequests(state)
  }
}

export default connect(mapStateToProps)(view)
