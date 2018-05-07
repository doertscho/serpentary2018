import * as React from 'react'

import { Localisable } from '../locales'

interface Props extends Localisable {
  refresh: () => void
}

export default (props: Props) =>
  <div>
    <span onClick={props.refresh}>
      { props.l('REFRESH', 'Refresh') }
    </span>
  </div>
