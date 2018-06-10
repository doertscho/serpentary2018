import * as React from 'react'
import { connect } from 'react-redux'

import { StoreState } from '../types'
import { hasPendingRequests } from '../selectors'

interface Props {
  hasPendingRequests: boolean
}

const view = (props: Props) => {

  if (!props.hasPendingRequests) return null

  return (
    <div className="activityReporter">
      <i className="fas fa-futbol fa-spin"></i>
    </div>
  )
}

const mapStateToProps = (state: StoreState) => {
  return {
    hasPendingRequests: hasPendingRequests(state)
  }
}

export default connect(mapStateToProps)(view)
