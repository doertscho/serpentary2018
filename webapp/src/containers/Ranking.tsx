import { connect, Dispatch } from 'react-redux'
import { StoreState } from '../types'
import { models } from '../types/models'
import { Action } from '../actions'

import view from '../components/RankingView'

const mapStateToProps = (state: StoreState) => {
  return { }
}

export default connect(mapStateToProps)(view)
