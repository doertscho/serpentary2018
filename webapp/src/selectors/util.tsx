import { createSelector, ParametricSelector } from 'reselect'

import { StoreState } from '../types'

export const makeGetUrlParameter = (key: string) =>
  (_: StoreState, props?: any) => props.match.params[key]

export type NumberSelector = ParametricSelector<StoreState, any, number>

export const makeGetNumberUrlParameter = (key: string) => {
  const getUrlParameter = makeGetUrlParameter(key)
  return createSelector(
    [getUrlParameter],
    (   urlParameter) =>
      parseInt(urlParameter)
  )
}
