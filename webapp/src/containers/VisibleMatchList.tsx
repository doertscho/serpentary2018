import { connect, Dispatch } from 'react-redux'
import { StoreState } from '../types'
import { models } from '../types/models.js'
import { MatchList } from '../components/MatchList'
import { Action } from '../actions';

const mapStateToProps = (state: StoreState) => {
  return {
    matches: Array.from(state.matches.values())
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return { }
}

export const VisibleMatchList = connect(
  mapStateToProps,
  mapDispatchToProps
)(MatchList)
