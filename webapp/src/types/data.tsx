import { models as m } from './models'

export interface Entity {
  updated?: number
}

export type Map<T> = { [key: string]: T }

export type ParentChildTable = Map<string[]>

export function joinKeys(
    keyA: number | string, keyB: number | string): string {
  return '' + keyA + '/' + keyB
}

export interface DataState {

  tournaments: Map<m.Tournament>
  matchDays: Map<m.MatchDay>
  matchDaysByTournament: ParentChildTable
  matches: Map<m.Match>
  matchesByMatchDay: ParentChildTable

  users: Map<m.User>
  squads: Map<m.Squad>
  pools: Map<m.Pool>
  poolsByTournament: ParentChildTable
  poolsBySquad: ParentChildTable

  bets: Map<m.MatchDayBetBucket>
}

export const INITIAL_DATA_STATE: DataState = {

  tournaments: {},
  matchDays: {},
  matchDaysByTournament: {},
  matches: {},
  matchesByMatchDay: {},

  users: {},
  squads: {},
  pools: {},
  poolsByTournament: {},
  poolsBySquad: {},

  bets: {},
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
const sampleTournaments: Map<m.Tournament> = {}
sampleTournaments[1] =
    m.Tournament.create({ id: 1, name: tournamentOneName })
const sampleMatchDays: Map<m.MatchDay> = {}
sampleMatchDays[1] =
    m.MatchDay.create({ id: 1, tournamentId: 1 })
const sampleMatches: Map<m.Match> = {}
sampleMatches[1] =
    m.Match.create({ id: 1, matchDayId: 1, homeTeamId: 1, awayTeamId: 1, })
sampleMatches[2] =
    m.Match.create({ id: 2, matchDayId: 1, homeTeamId: 3, awayTeamId: 4, })

const sampleUsers: Map<m.User> = {}
sampleUsers['User1'] = m.User.create({ name: 'User1' })
sampleUsers['User2'] = m.User.create({ name: 'User2' })

const sampleSquads: Map<m.Squad> = {}
sampleSquads['squad1'] = m.Squad.create({
  name: 'squad1', members: ['User1', 'User2'] })

const samplePools: Map<m.Pool> = {}
samplePools['squad1/1'] =m.Pool.create({
  squadName: 'squad1', tournamentId: 1, participants: ['User1', 'User2'] })

const sampleBetBucket = m.MatchDayBetBucket.create({
  squadName: 'squad1',
  matchDayId: 1,
  updated: 1,
  bets: [
    m.MatchBetBucket.create({
      matchId: 1,
      bets: [
        m.Bet.create({
          userName: 'User1',
          homeGoals: 3,
          awayGoals: 0,
        }),
        m.Bet.create({
          userName: 'User2',
          homeGoals: 1,
          awayGoals: 2,
        }),
      ],
    }),
  ],
})
const sampleBets: Map<m.MatchDayBetBucket> = {}
sampleBets['squad1/1'] = sampleBetBucket

export const SAMPLE_DATA_STATE: DataState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: { '1': ['1'] },
  matches: sampleMatches,
  matchesByMatchDay: { '1': ['1', '2'] },

  users: sampleUsers,
  squads: sampleSquads,
  pools: samplePools,
  poolsByTournament: { '1': ['1'] },
  poolsBySquad: { '1': ['1'] },

  bets: sampleBets,
}
