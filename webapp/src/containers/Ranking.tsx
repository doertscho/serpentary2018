import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { Localisable, localisableComponent } from '../locales'

const view = ({ l }: Localisable) =>
  <div>
    <h1>Ranking</h1>
  </div>

export default localisableComponent(view)
