import { models as m } from './models'

export interface Entity {
  id?: number
  updated?: number
}

export type ParentChildTable = number[][]

export interface DataState {
  tournaments: m.Tournament[]
  matchDays: m.MatchDay[]
  matchDaysByTournament: ParentChildTable
  matches: m.Match[]
  matchesByMatchDay: ParentChildTable
}

export const INITIAL_DATA_STATE: DataState = {
    tournaments: [],
    matchDays: [],
    matchDaysByTournament: [],
    matches: [],
    matchesByMatchDay: []
}

const tournamentOneNameEn =
    m.Localisation.create({ locale: m.Locale.EN, value: 'World Cup 2018' })
const tournamentOneNameDe =
    m.Localisation.create({ locale: m.Locale.DE, value: 'Weltmeisterschaft 2018' })
const tournamentOneName =
    m.LocalisableString.create({
      localisations: [ tournamentOneNameEn, tournamentOneNameDe ]
    })
const sampleTournaments = []
sampleTournaments[1] =
    m.Tournament.create({ id: 1, name: tournamentOneName })
const sampleMatchDays = []
sampleMatchDays[1] =
    m.MatchDay.create({ id: 1, tournamentId: 1 })
const sampleMatches = []
sampleMatches[1] =
    m.Match.create({ id: 1, matchDayId: 1, homeTeamId: 1, awayTeamId: 1})
sampleMatches[2] =
    m.Match.create({ id: 2, matchDayId: 1, homeTeamId: 3, awayTeamId: 4})

export const SAMPLE_DATA_STATE: DataState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: [ [], [1] ],
  matches: sampleMatches,
  matchesByMatchDay: [ [], [1, 2] ]
}
