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

  users: m.User[]
  squads: m.Squad[]
  pools: m.Pool[]
  poolsByTournament: ParentChildTable
  poolsBySquad: ParentChildTable

  bets: m.MatchDayBetBucket[]
}

export const INITIAL_DATA_STATE: DataState = {

  tournaments: [],
  matchDays: [],
  matchDaysByTournament: [],
  matches: [],
  matchesByMatchDay: [],

  users: [],
  squads: [],
  pools: [],
  poolsByTournament: [],
  poolsBySquad: [],

  bets: [],
}

const tournamentOneNameEn =
    m.Localisation.create({
      locale: m.Locale.EN,
      value: 'World Cup 2018'
    })
const tournamentOneNameDe =
    m.Localisation.create({
      locale: m.Locale.DE,
      value: 'Weltmeisterschaft 2018'
    })
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
    m.Match.create({ id: 1, matchDayId: 1, homeTeamId: 1, awayTeamId: 1, })
sampleMatches[2] =
    m.Match.create({ id: 2, matchDayId: 1, homeTeamId: 3, awayTeamId: 4, })

const sampleBetBucket = m.MatchDayBetBucket.create({
  id: 1,
  updated: 1,
  poolId: 1,
  matchDayId: 1,
  bets: [
    m.MatchBetBucket.create({
      matchId: 1,
      bets: [
        m.Bet.create({
          userId: 1,
          homeGoals: 3,
          awayGoals: 0,
        }),
      ],
    }),
  ],
})

export const SAMPLE_DATA_STATE: DataState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: [ [], [1] ],
  matches: sampleMatches,
  matchesByMatchDay: [ [], [1, 2] ],

  users: [],
  squads: [],
  pools: [],
  poolsByTournament: [],
  poolsBySquad: [],

  bets: [ sampleBetBucket ],
}
