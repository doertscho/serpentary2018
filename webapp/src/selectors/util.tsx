import { createSelector, ParametricSelector } from 'reselect'

import { StoreState } from '../types'

export const makeGetUrlParameter = (key: string) =>
  (_: StoreState, props?: any) => props.match.params[key]

export type StringSelector = ParametricSelector<StoreState, any, string>
export type NumberSelector = ParametricSelector<StoreState, any, number>
export type ModelSelector<M> = ParametricSelector<StoreState, any, M>

export function makeGetNumberUrlParameter(key: string): NumberSelector {
  const getUrlParameter = makeGetUrlParameter(key)
  return createSelector(
    [getUrlParameter],
    (   urlParameter) =>
      parseInt(urlParameter)
  )
}
