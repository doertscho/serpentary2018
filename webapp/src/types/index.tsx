import { models as m } from './models'

export interface Entity {
  id?: number
  updated?: number
}

export type ParentChildTable = number[][]

export interface StoreState {
  tournaments: m.Tournament[]
  matchDays: m.MatchDay[]
  matchDaysByTournament: ParentChildTable
  matches: m.Match[]
  matchesByMatchDay: ParentChildTable
}

export const EMPTY: StoreState = {
  tournaments: [],
  matchDays: [],
  matchDaysByTournament: [],
  matches: [],
  matchesByMatchDay: []
}

const sampleTournaments = []
sampleTournaments[1] = m.Tournament.create({ id: 1, name: 'Test' })
const sampleMatchDays = []
sampleMatchDays[1] =
  m.MatchDay.create({ id: 1, tournamentId: 1, name: 'Erster Spieltag' })
const sampleMatches = []
sampleMatches[1] =
  m.Match.create({ id: 1, matchDayId: 1, homeTeamId: 1, awayTeamId: 1})
sampleMatches[2] =
  m.Match.create({ id: 2, matchDayId: 1, homeTeamId: 3, awayTeamId: 4})
export const SAMPLE: StoreState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: [ [], [1] ],
  matches: sampleMatches,
  matchesByMatchDay: [ [], [1, 2] ]
}
