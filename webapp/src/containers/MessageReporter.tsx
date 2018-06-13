import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import * as constants from '../constants'
import { StoreState } from '../types'
import { Action } from '../actions'
import { hideMessage } from '../actions/ui'
import { getMessage, getMessageType } from '../selectors'
import { Localisable, withLocaliser } from '../locales'

interface Props extends Localisable {
  message: string
  messageType: string
  hideMessage: () => void
}

const view = (props: Props) => {

  let message = props.message
  let messageType = props.messageType
  let l = props.l
  let hideMessage = props.hideMessage

  if (!message) return null

  if (messageType == constants.MESSAGE_ERROR)
    return (
      <div className="messageBox error" onClick={hideMessage}>
        <div className="errorTitle">
          { l('ERROR_TITLE', 'An error has occurred') }
        </div>
        <div>{message}</div>
      </div>
    )

  return (
    <div className="messageBox note" onClick={hideMessage}>
      <div>{message}</div>
    </div>
  )
}

const mapStateToProps = withLocaliser((state: StoreState) => {
  return {
    message: getMessage(state),
    messageType: getMessageType(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    hideMessage: () => { dispatch(hideMessage()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(view)
