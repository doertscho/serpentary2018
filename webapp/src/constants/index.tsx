// top-level action types
export const REQUEST = 'REQUEST'
export type REQUEST = typeof REQUEST
export const RESPONSE = 'RESPONSE'
export type RESPONSE = typeof RESPONSE
export const ERROR = 'ERROR'
export type ERROR = typeof ERROR
export const ONE_OFF = 'ONE_OFF'
export type ONE_OFF = typeof ONE_OFF

// top-level action categories
export const INIT = 'INIT'
export type INIT = typeof INIT
export const DATA = 'DATA'
export type DATA = typeof DATA
export const SESSION = 'SESSION'
export type SESSION = typeof SESSION
export const UI = 'UI'
export type UI = typeof UI

// secondary session action types / operations
export const SIGN_UP = 'SIGN_UP'
export type SIGN_UP = typeof SIGN_UP
export const LOG_IN = 'LOG_IN'
export type LOG_IN = typeof LOG_IN
export const LOG_OUT = 'LOG_OUT'
export type LOG_OUT = typeof LOG_OUT
export const SET_LOCALE = 'SET_LOCALE'
export type SET_LOCALE = typeof SET_LOCALE
export const USER_DATA_RECEIVED = 'USER_DATA_RECEIVED'
export type USER_DATA_RECEIVED = typeof USER_DATA_RECEIVED

// secondary ui action types
export const SHOW_POPOVER = 'SHOW_POPOVER'
export type SHOW_POPOVER = typeof SHOW_POPOVER
export const HIDE_POPOVER = 'HIDE_POPOVER'
export type HIDE_POPOVER = typeof HIDE_POPOVER
export const HIDE_ERROR = 'HIDE_ERROR'
export type HIDE_ERROR = typeof HIDE_ERROR
export const SET_CURRENT_SQUAD = 'SET_CURRENT_SQUAD'
export type SET_CURRENT_SQUAD = typeof SET_CURRENT_SQUAD
