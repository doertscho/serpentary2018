import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { getLocale } from '../selectors/session'
import { Translation } from './base'

import translation_de from './translation_de'

export type Localiser =
  (
    ref: string | number | m.ILocalisableString,
    fallback?: string,
    ...args: any[]
  ) => string

export interface Localisable {
  l: Localiser
}

export const getLocaliser =
    createSelector(
      [getLocale],
      (localeName) => {
        if (localeNameToLocaleId[localeName] && translations[localeName])
          return localiseWithTranslation(
              localeNameToLocaleId[localeName], translations[localeName])
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

export const supportedLocales = ['de', 'en']
export const localeNameToLocaleId: { [name: string]: m.Locale } = {
  'en': m.Locale.EN,
  'de': m.Locale.DE,
}

const empty: Translation = { }

const translations: { [localeName: string]: Translation } = {
  'en': empty, // expecting English values to be defined inline as fallback
  'de': translation_de,
}

export const localeIdToJavaScriptDateLocale: { [id: number]: string } = { }
localeIdToJavaScriptDateLocale[m.Locale.EN] = 'en-UK'
localeIdToJavaScriptDateLocale[m.Locale.DE] = 'de-DE'

const defaultLocaleId = m.Locale.EN

function localiseWithTranslation(
    localeId: number, translation: Translation): Localiser {

  return (ref, alt, args) => {
    if (!ref) {
      if (alt)
        return integrateArgs(alt, args)
      return '???'
    }
    if (typeof ref == 'string') {
      let key = ref
      if (translation[key])
        return integrateArgs(translation[key], args)
      if (alt)
        return integrateArgs(alt, args)
      return key
    } else if (typeof ref == 'number') {
      return formatTimestamp(ref, localeId, alt)
    } else {
      let localisableString = ref
      return selectFromLocalisableString(localisableString, localeId)
    }
  }
}

const localiseWithFallback: Localiser = (ref, alt, args) => {
  if (typeof ref == 'string') {
    if (alt)
      return integrateArgs(alt, args)
    return ref
  } else if (typeof ref == 'number') {
    return formatTimestamp(ref, defaultLocaleId, alt)
  } else {
    return selectFromLocalisableString(ref, defaultLocaleId)
  }
}

function formatTimestamp(
    timestamp: number, preferredLocale: number, option?: string): string {

  let date = new Date(timestamp * 1000)
  let localeString = localeIdToJavaScriptDateLocale[preferredLocale]
  if (option == 'date') {
    return date.toLocaleDateString(localeString)
  } else if (option == 'time') {
    return date.toLocaleTimeString(localeString)
  } else {
    return date.toLocaleDateString(localeString) + ', ' +
        date.toLocaleTimeString(localeString)
  }
}

function integrateArgs(template: string, ...args: any[]): string {
  var result = template
  for (var i = 0; i < args.length; i++) {
    result = result.replace('{}', args[i])
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
