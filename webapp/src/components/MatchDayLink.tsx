import * as React from 'react'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { Localisable, localisableComponent } from '../locales'

interface Props extends Localisable {
  matchDay: m.MatchDay
}

const view = (props: Props) => {
  let l = props.l
  let matchDay = props.matchDay
  return (
    <Link to={
        '/tournaments/' + matchDay.tournamentId +
        '/match-days/' + matchDay.id}>
      { l(matchDay.name) } {' '} (#{matchDay.id})
    </Link>
  )
}

export default localisableComponent(view)
