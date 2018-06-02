import * as React from 'react'

import { Localisable, localisableComponent } from '../locales'

interface Props extends Localisable {
  refresh: () => void
}

const view = (props: Props) =>
  <div className="refreshButton">
    <span onClick={props.refresh}>
      { props.l('REFRESH', 'Refresh data') }
    </span>
  </div>

export default localisableComponent(view)
