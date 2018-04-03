import { connect, Dispatch } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { StoreState } from '../types'
import { models } from '../types/models.js'
import { MatchList } from '../components/MatchList'
import { Action } from '../actions'

const mapStateToProps = (state: StoreState) => {
  console.log("state: ", state);
  return {
    matches: state.matches.valueSeq()
  }
}

export const MatchDay = connect(mapStateToProps)(MatchList)
