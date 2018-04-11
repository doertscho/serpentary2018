import { Map, Record } from 'immutable'
import { models } from './models'

interface StoreStateProps {
  tournaments: Map<number, models.Tournament>
  matchDays: Map<number, models.MatchDay>
  matches: Map<number, models.Match>
}

const StoreStateRecord = Record({
  tournaments: Map<number, models.Tournament>()
, matchDays: Map<number, models.MatchDay>()
, matches: Map<number, models.Match>()
})

export class StoreState extends StoreStateRecord implements StoreStateProps {

    tournaments: Map<number, models.Tournament>
    matchDays: Map<number, models.MatchDay>
    matches: Map<number, models.Match>

    constructor(props: Partial<StoreStateProps>) {
      super(props)
    }

    public static EMPTY: StoreState = new StoreState({})

    public static SAMPLE: StoreState = new StoreState({
      tournaments: Map<number, models.Tournament>()
        .set(1, models.Tournament.create({ id: 1, name: 'Test' }))
    , matchDays: Map<number, models.MatchDay>()
        .set(1, models.MatchDay.create({ id: 1, tournamentId: 1, name: "Erster Spieltag" }))
    , matches: Map<number, models.Match>()
        .set(1, models.Match.create({ id: 1, matchDayId: 1, homeTeamId: 1, awayTeamId: 1}))
        .set(2, models.Match.create({ id: 2, matchDayId: 1, homeTeamId: 3, awayTeamId: 4}))
    })
}
