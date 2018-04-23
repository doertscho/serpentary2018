import { createSelector } from 'reselect'

import { Locale } from './base'
import { de } from './locale_de'
import { StoreState } from '../types'
import { getLocale } from '../selectors/session'

export type Localiser =
  (key: string, fallback?: string, ...args: any[]) => string

export interface Localisable {
  l: Localiser
}

const empty: Locale = { }

const locales: { [name: string]: Locale } = {
  de: de,
  en: empty,
}

function integrateArgs(template: string, ...args: any[]): string {
  var result = template
  for (var idx in args) {
    result = result.replace('{}', args[idx])
  }
  return result
}

function localiseWithLocale(locale: Locale): Localiser {
  return (key, fallback, args) => {
    if (locale[key])
      return integrateArgs(locale[key], args)
    if (fallback)
      return integrateArgs(fallback, args)
    return key
  }
}

const localiseWithFallback: Localiser = (key, fallback, args) => {
  if (fallback)
    return integrateArgs(fallback, args)
  return key
}

export const getLocaliser =
    createSelector(
      [getLocale],
      (locale) => {
        if (locale && locales[locale])
          return localiseWithLocale(locales[locale])
        return localiseWithFallback
      }
    )

export function withLocaliser(
    mapProps: (state: StoreState, props?: any) => any) {

  return function(state: StoreState, props?: any) {
    let result = mapProps(state, props) || { }
    result.l = getLocaliser(state)
    return result
  }
}
