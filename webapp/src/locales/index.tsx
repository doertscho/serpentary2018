import { createSelector } from 'reselect'
import { connect } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { getLocale } from '../selectors/session'
import { Translation, TimeFormats } from './base'

import translation_en from './translation_en'
import translation_de from './translation_de'
import time_formats_en from './time_formats_en'
import time_formats_de from './time_formats_de'

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
    let l = getLocaliser(state)
    let propsCopy: any = {}
    for (let key in props) {
      propsCopy[key] = props[key]
    }
    propsCopy.l = l
    let result = mapProps(state, propsCopy) || { }
    result.l = l
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
  'en': translation_en,
  'de': translation_de,
}

const localeIdToTimeFormats: { [localeId: number]: TimeFormats } = { }
localeIdToTimeFormats[m.Locale.EN] = time_formats_en
localeIdToTimeFormats[m.Locale.DE] = time_formats_de

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
    } else if (ref) {
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
  let timeFormats = localeIdToTimeFormats[preferredLocale]
  if (option && timeFormats[option]) {
    return timeFormats[option](date)
  }

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

  if (!localisable || !localisable.localisations) return '???'

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
