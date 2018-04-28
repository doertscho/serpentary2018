import * as React from 'react'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { Localisable, localisableComponent } from '../locales'

interface Props extends Localisable {
  tournament: m.Tournament
}

const view = ({ tournament, l }: Props) =>
  <Link to={'/tournaments/' + tournament.id}>
    { l(tournament.name) } (#{tournament.id})
  </Link>

export default localisableComponent(view)
