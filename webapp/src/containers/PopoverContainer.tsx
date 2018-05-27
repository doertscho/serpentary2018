import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { getPopoverElement } from '../selectors/ui'
import { Action } from '../actions'
import { hidePopover } from '../actions/ui'

interface Props {
  element: React.ReactElement<any>
  hidePopover: () => void
}

const popoverContainer = (props: Props) => {
  console.log("got popover:", props.element)
  if (!props.element) return null
  let hidePopover = props.hidePopover
  return (
    <div className="popoverBackground" onClick={hidePopover}>
      <div className="popoverContainer"
          onClick={event => event.stopPropagation()}>
        <div className="popoverHeader">
          <span onClick={hidePopover}>X</span>
        </div>
        { props.element }
      </div>
    </div>
  )
}

const mapStateToProps = (state: StoreState) => {
  return {
    element: getPopoverElement(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    hidePopover: () => { dispatch(hidePopover()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(popoverContainer)
