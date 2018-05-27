import { models as m } from './models'

export interface Entity {
  updated?: number
}

export type Map<T> = { [key: string]: T }

export function mapValues<T>(input: Map<T>): T[] {
  let output: T[] = []
  for (let key in input) {
    if (input[key]) output.push(input[key])
  }
  return output
}

export type ParentChildTable = Map<string[]>

export function joinKeys(
    keyA: number | string,
    keyB: number | string,
    keyC?: number | string
): string {
  let result = '' + keyA + '/' + keyB
  if (keyC) result = result + '/' + keyC
  return result
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

const tournamentOneName =
    m.LocalisableString.create({
      localisations: [
        m.Localisation.create({
          locale: m.Locale.EN,
          value: 'World Cup 2018'
        }),
        m.Localisation.create({
          locale: m.Locale.DE,
          value: 'Weltmeisterschaft 2018'
        })
      ]
    })
const sampleTournaments: Map<m.Tournament> = {}
sampleTournaments['world-cup-2018'] =
    m.Tournament.create({ id: 'world-cup-2018', name: tournamentOneName })

const matchDayOneName =
    m.LocalisableString.create({
      localisations: [
        m.Localisation.create({
          locale: m.Locale.EN,
          value: 'Group stage, round 1'
        }),
        m.Localisation.create({
          locale: m.Locale.DE,
          value: 'Gruppenphase, 1. Spieltag'
        })
      ]
    })
const sampleMatchDays: Map<m.MatchDay> = {}
sampleMatchDays['world-cup-2018/group-stage-1'] =
    m.MatchDay.create({
      tournamentId: 'world-cup-2018',
      id: 'group-stage-1',
      name: matchDayOneName
    })
const sampleMatches: Map<m.Match> = {}
sampleMatches['world-cup-2018/group-stage-1/1'] =
    m.Match.create({
      tournamentId: 'world-cup-2018',
      matchDayId: 'group-stage-1',
      id: 1,
      homeTeamId: "russia",
      awayTeamId: "saudi-arabia",
    })
sampleMatches['world-cup-2018/group-stage-1/2'] =
    m.Match.create({
      tournamentId: 'world-cup-2018',
      matchDayId: 'group-stage-1',
      id: 2,
      homeTeamId: "egypt",
      awayTeamId: "uruguay",
    })

const sampleUsers: Map<m.User> = {}
sampleUsers['User1'] = m.User.create({ id: 'User1' })
sampleUsers['User2'] = m.User.create({ id: 'User2' })

const sampleSquads: Map<m.Squad> = {}
sampleSquads['squad1'] = m.Squad.create({
  id: 'squad1', members: ['User1', 'User2'] })

const samplePools: Map<m.Pool> = {}
samplePools['squad1/world-cup-2018'] = m.Pool.create({
  squadId: 'squad1',
  tournamentId: 'world-cup-2018',
  participants: ['User1', 'User2']
})

const sampleBetBucket = m.MatchDayBetBucket.create({
  squadId: 'squad1',
  tournamentId: 'world-cup-2018',
  matchDayId: 'group-stage-1',
  bets: [
    m.MatchBetBucket.create({
      matchId: 1,
      bets: [
        m.Bet.create({
          userId: 'User1',
          homeGoals: 3,
          awayGoals: 0,
        }),
        m.Bet.create({
          userId: 'User2',
          homeGoals: 1,
          awayGoals: 2,
        }),
      ],
    }),
  ],
})
const sampleBets: Map<m.MatchDayBetBucket> = {}
sampleBets['squad1/world-cup-2018/group-stage-1'] = sampleBetBucket

export const SAMPLE_DATA_STATE: DataState = {
  tournaments: sampleTournaments,
  matchDays: sampleMatchDays,
  matchDaysByTournament: { 'world-cup-2018': ['world-cup-2018/group-stage-1'] },
  matches: sampleMatches,
  matchesByMatchDay: {
    'world-cup-2018/group-stage-1': [
      'world-cup-2018/group-stage-1/1',
      'world-cup-2018/group-stage-1/2'
    ]
  },

  users: sampleUsers,
  squads: sampleSquads,
  pools: samplePools,
  poolsByTournament: { 'world-cup-2018': ['squad1/world-cup-2018'] },
  poolsBySquad: { 'squad1': ['squad1/world-cup-2018'] },

  bets: sampleBets,
}
