import { createSelector } from 'reselect'

import { StoreState } from '../types'
import { getMatches } from './index'

const getMatchDayId = (_: StoreState, props: any) => props.id

export const getMatchDay = (store: StoreState, props: any) =>
  store.matchDays[getMatchDayId(store, props)]

export const makeGetMatches = () =>
  createSelector(
    [getMatches, getMatchDayId],
    (   matches,    matchDayId) =>
      matches.filter(match => match.matchDayId == matchDayId)
  )
