import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Localisable, localisableComponent } from '../locales'

const view = ({ l }: Localisable) =>
  <nav className="nav">
    <div className="primaryNav">
      <ul>
        <li><Link to='/'>{ l('NAV_HOME', 'Dashboard')}</Link></li>
        <li>
          <Link to='/squads/squad1'>{ l('NAV_SQUAD', 'Squad') }</Link>
        </li>
        <li><Link to='/ranking'>{ l('NAV_RANKING', 'Ranking') }</Link></li>
      </ul>
    </div>
    <div className="secondaryNav">
      <ul>
        <li><Link to='/'>{ l('NAV_HOME', 'Dashboard')}</Link></li>
        <li>
          <Link to='/squads/squad1'>{ l('NAV_SQUAD', 'Squad') }</Link>
        </li>
        <li><Link to='/ranking'>{ l('NAV_RANKING', 'Ranking') }</Link></li>
      </ul>
    </div>
  </nav>

export default localisableComponent(view)
