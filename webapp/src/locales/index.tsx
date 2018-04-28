import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { getLocale } from '../selectors/session'
import { Locale } from './base'
import { de } from './locale_de'

export type Localiser =
  (
    ref: string | m.ILocalisableString,
    fallback?: string,
    ...args: any[]
  ) => string

export interface Localisable {
  l: Localiser
}

const empty: Locale = { }

const locales: { [name: string]: Locale } = {
  de: de,
  en: empty,
}

const localeIds: { [name: string]: number } = {
  de: m.Locale.DE,
  en: m.Locale.EN,
}

const defaultLocale = m.Locale.EN

function integrateArgs(template: string, ...args: any[]): string {
  var result = template
  for (var idx in args) {
    result = result.replace('{}', args[idx])
  }
  return result
}

function selectFromLocalisableString(
    localisable: m.ILocalisableString, preferredLocale: number) {

  let count = localisable.localisations.length
  if (count == 0) {
    return '???'
  }

  for (var i = 0; i < count; i++) {
    let entry = localisable.localisations[i]
    if (entry.locale == preferredLocale) {
      return entry.value
    }
  }

  return localisable.localisations[0].value
}

function localiseWithLocale(locale: Locale, localeId: number): Localiser {
  return (ref, fallback, args) => {
    if (typeof ref == 'string') {
      if (locale[ref])
        return integrateArgs(locale[ref], args)
      if (fallback)
        return integrateArgs(fallback, args)
      return ref
    } else {
      return selectFromLocalisableString(ref, localeId)
    }
  }
}

const localiseWithFallback: Localiser = (ref, fallback, args) => {
  if (typeof ref == 'string') {
    if (fallback)
      return integrateArgs(fallback, args)
    return ref
  } else {
    return selectFromLocalisableString(ref, defaultLocale)
  }
}

export const getLocaliser =
    createSelector(
      [getLocale],
      (locale) => {
        if (locale && locales[locale])
          return localiseWithLocale(locales[locale], localeIds[locale])
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

export function localisableComponent(view: any) {
  return connect(withLocaliser(() => {}))(view)
}
