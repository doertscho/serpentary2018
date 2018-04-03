import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'

import { Dashboard } from './containers/Dashboard'
import { MatchDay } from './containers/MatchDay'
import { Ranking } from './containers/Ranking'
import { NotFound } from './components/NotFound'

export const App = () =>
  <Router>
    <div className='page-container'>
      <h1>serpentary 2018</h1>
      <nav>
        <ul>
          <li><Link to='/home'>Home</Link></li>
          <li><Link to='/match-day'>Match day</Link></li>
          <li><Link to='/ranking'>Ranking</Link></li>
        </ul>
      </nav>
      <main>
        <Switch>
          <Route path='/home' component={ Dashboard } />
          <Route path='/match-day' component={ MatchDay } />
          <Route path='/ranking' component={ Ranking } />
          <Route component={ NotFound } />
        </Switch>
      </main>
    </div>
  </Router>
