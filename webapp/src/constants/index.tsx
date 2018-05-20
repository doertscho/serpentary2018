// top-level action types
export const REQUEST = 'REQUEST'
export type REQUEST = typeof REQUEST
export const RESPONSE = 'RESPONSE'
export type RESPONSE = typeof RESPONSE
export const ERROR = 'ERROR'
export type ERROR = typeof ERROR

// top-level action categories
export const INIT = 'INIT'
export type INIT = typeof INIT
export const DATA = 'DATA'
export type DATA = typeof DATA
export const SESSION = 'SESSION'
export type SESSION = typeof SESSION

// secondary session action types / operations
export const SIGN_UP = 'SIGN_UP'
export type SIGN_UP = typeof SIGN_UP
export const LOG_IN = 'LOG_IN'
export type LOG_IN = typeof LOG_IN
export const LOG_OUT = 'LOG_OUT'
export type LOG_OUT = typeof LOG_OUT
export const SET_LOCALE = 'SET_LOCALE'
export type SET_LOCALE = typeof SET_LOCALE
