import { models as m } from './models'

export interface Entity {
  id?: number
  updated?: number
}

export type ParentChildTable = number[][]
export type CombinedParentChildTable = { [key: string]: number }

export function joinKeys(keyA: number, keyB: number): string {
  return '' + keyA + '/' + keyB
}

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
  poolsByTournamentAndSquad: CombinedParentChildTable

  bets: m.MatchDayBetBucket[]
  betsByMatchDayAndPool: CombinedParentChildTable
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
  poolsByTournamentAndSquad: {},

  bets: [],
  betsByMatchDayAndPool: {},
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

const sampleUsers = []
sampleUsers[1] = m.User.create({ id: 1, name: 'User1' })
sampleUsers[2] = m.User.create({ id: 2, name: 'User2' })

const sampleSquads = []
sampleSquads[1] = m.Squad.create({ id: 1, name: 'squad1', members: [1, 2] })

const samplePools = []
samplePools[1] =
    m.Pool.create({ id: 1, squadId: 1, tournamentId: 1, participants: [1, 2] })

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
        m.Bet.create({
          userId: 2,
          homeGoals: 1,
          awayGoals: 2,
        }),
      ],
    }),
  ],
})
const sampleBets = []
sampleBets[1] = sampleBetBucket

export const SAMPLE_DATA_STATE: DataState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: [ [], [1] ],
  matches: sampleMatches,
  matchesByMatchDay: [ [], [1, 2] ],

  users: sampleUsers,
  squads: sampleSquads,
  pools: samplePools,
  poolsByTournament: [ [], [1] ],
  poolsBySquad: [ [], [1] ],
  poolsByTournamentAndSquad: { '1/1': 1 },

  bets: sampleBets,
  betsByMatchDayAndPool: { '1/1': 1 },
}
