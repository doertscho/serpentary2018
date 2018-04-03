import { connect, Dispatch } from 'react-redux'
import { StoreState } from '../types'
import { models } from '../types/models.js'
import { RankingView } from '../components/RankingView'
import { Action } from '../actions';

const mapStateToProps = (state: StoreState) => {
  return { }
}

export const Ranking = connect(mapStateToProps)(RankingView)
