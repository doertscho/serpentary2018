import { Locale, Localiser } from './base'
import { de } from './locale_de'

const locales: { [name: string]: Locale } = {
  de: de,
}

const empty: Locale = { }

var preferredLocale: Locale = empty

export function setPreferredLocale(locale: string) {
  if (!locales[locale]) {
    console.log("requested unknown locale", locale)
    return
  }
  preferredLocale = locales[locale]
}

function integrateArgs(template: string, ...args: any[]): string {
  // TODO
  return template
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

export function getLocaliser(locale?: string): Localiser {
  if (locale && locales[locale])
    return localiseWithLocale(locales[locale])
  return localiseWithFallback
}
