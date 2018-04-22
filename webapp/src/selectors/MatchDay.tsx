import { createSelector } from 'reselect'

import { StoreState } from '../types'
import { getMatches, getMatchDays } from './data'

const getMatchDayId = (_: StoreState, props: any) => props.id

export const getMatchDay = (state: StoreState, props: any) =>
  getMatchDays(state)[getMatchDayId(state, props)]

export const makeGetMatches = () =>
  createSelector(
    [getMatches, getMatchDayId],
    (   matches,    matchDayId) =>
      matches.filter(match => match.matchDayId == matchDayId)
  )
