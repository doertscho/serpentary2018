import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Redirect, withRouter, RouteComponentProps } from 'react-router-dom'

import { StoreState } from '../types'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import { updatePreferredName } from '../actions/session'
import {
  showMessage,
  hideMessage
} from '../actions/ui'
import { Localiser, Localisable, withLocaliser } from '../locales'
import { getUserId, getPreferredUserName } from '../selectors/session'

interface Props extends Localisable, RouteComponentProps<any> {
  userId: string
  preferredUserName: string
  updatePreferredName: (newName: string, callbacks?: Callbacks) => void
  showMessage: (message: string) => void
  hideMessage: () => void
}

interface State {
  preferredUserName: string
}

class view extends React.Component<Props, State> {

  render() {

    let userId = this.props.userId
    if (!userId)
      return <Redirect to={
        {pathname: '/log-in', state: { from: this.props.location }}} />

    let l = this.props.l

    return (
      <div>
        <h1>{ l('PROFILE_PAGE_TITLE', 'Edit your profile') }</h1>
        <form onSubmit={e => {
          e.preventDefault()
          this.submit()
        }}>
          <div className="formRow">
            <div className="formInput">
              {userId}
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l('PROFILE_USER_ID_LABEL_HEAD', 'Your account ID') }
              </div>
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <input type="text" value={this.state.preferredUserName}
                onChange={this.onPreferredUserNameChange} />
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l('PROFILE_PREFERRED_NAME_HEAD', 'Your preferred user name') }
              </div>
            </div>
          </div>
          <div className="formRow">
            <div className="formInput">
              <button>
                { l('PROFILE_SAVE_BUTTON', 'Make it so') }
              </button>
            </div>
          </div>
        </form>
      </div>
    )
  }

  constructor(props: Props) {
    super(props)
    this.state = { preferredUserName: props.preferredUserName || '' }

    this.onPreferredUserNameChange = this.onPreferredUserNameChange.bind(this)
    this.submit = this.submit.bind(this)
  }

  onPreferredUserNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ preferredUserName: event.target.value })
  }

  submit() {
    let newName = this.state.preferredUserName
    if (!newName || !newName.length || !newName.trim().length) return

    let showMessage = this.props.showMessage
    let hideMessage = this.props.hideMessage
    let l = this.props.l

    this.props.updatePreferredName(
      newName,
      {
        onSuccess: () => {
          showMessage(
            l('PROFILE_UPDATED', 'Your profile has been updated!'))
          setTimeout(hideMessage, 3000)
        }
      }
    )
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  return {
    userId: getUserId(state),
    preferredUserName: getPreferredUserName(state)
  }
})

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    updatePreferredName: (newName: string, callbacks?: Callbacks) => {
      dispatch(updatePreferredName(newName, callbacks))
    },
    showMessage: (message: string) => { dispatch(showMessage(message)) },
    hideMessage: () => { dispatch(hideMessage()) },
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(view))
