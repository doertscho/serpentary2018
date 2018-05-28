import * as React from 'react'

import { models as m } from '../types/models'
import { Localisable, localisableComponent } from '../locales'
import { secondsToTimeout } from '../rules'

interface Props extends Localisable {
  match: m.Match
}

interface State {
  secondsToGo: number
}

class matchCountdownView extends React.Component<Props, State> {

  render() {
    let l = this.props.l
    let secondsToGo = this.state.secondsToGo
    if (secondsToGo > 0) {
      let minutes = Math.floor(secondsToGo / 60)
      let seconds = secondsToGo % 60
      let secondsFormatted = seconds < 10 ? '0' + seconds : seconds
      let highlight = minutes ? '' : 'urgent'
      return (
        <div className={'matchCountdown ' + highlight}>
          {minutes}:{secondsFormatted}
        </div>
      )
    } else {
      return (
        <div className="matchCountdown closed">
          { l('COUNTDOWN_CLOSED', 'closed!') }
        </div>
      )
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = { secondsToGo: secondsToTimeout(props.match) }

    this.tick = this.tick.bind(this)

    let self = this
    setInterval(self.tick, 1000)
  }

  tick() {
    if (this.state.secondsToGo > 0) {
      this.setState({ secondsToGo: this.state.secondsToGo - 1 })
    }
  }
}

export default localisableComponent(matchCountdownView)
