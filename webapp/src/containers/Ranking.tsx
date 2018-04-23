import * as React from 'react'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { models } from '../types/models'
import { Action } from '../actions'
import { Localisable, withLocaliser } from '../locales'

const view = ({ l }: Localisable) =>
  <div>
    <h1>Ranking</h1>
  </div>

const mapStateToProps = withLocaliser((state: StoreState) => { })

export default connect(mapStateToProps)(view)
