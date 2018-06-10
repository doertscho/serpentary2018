import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Action } from '../actions'
import { hideError } from '../actions/ui'
import { getErrorMessage } from '../selectors'
import { Localisable, withLocaliser } from '../locales'

interface Props extends Localisable {
  errorMessage: string
  hideError: () => void
}

const view = (props: Props) => {

  let errorMessage = props.errorMessage
  let l = props.l
  let hideError = props.hideError

  if (!errorMessage) return null

  return (
    <div className="errorBox" onClick={hideError}>
      <div className="errorTitle">
        { l('ERROR_TITLE', 'An error has occurred') }
      </div>
      <div>{errorMessage}</div>
    </div>
  )
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    errorMessage: getErrorMessage(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    hideError: () => { dispatch(hideError()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
