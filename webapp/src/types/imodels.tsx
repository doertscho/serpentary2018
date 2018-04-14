import { Map, Record } from 'immutable'
import { models } from './models'

export namespace imodels {

  const TournamentRecord = Record({
    id: -1
  , name: ""
  })

  export class Tournament extends TournamentRecord implements models.ITournament {

    id: number
    name: string

    constructor(props: Partial<models.ITournament>) {
      super(props)
    }
  }
}
