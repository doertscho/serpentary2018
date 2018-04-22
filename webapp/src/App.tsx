import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

import { Dashboard } from './containers/Dashboard'
import { SignUp } from './containers/SignUp'
import { LogIn } from './containers/LogIn'
import { Tournament } from './containers/Tournament'
import { MatchDay } from './containers/MatchDay'
import { Ranking } from './containers/Ranking'
import { UserBox } from './containers/UserBox'
import { NotFound } from './components/NotFound'

export const App = () =>
  <BrowserRouter>
    <div className='page-container'>
      <h1>serpentary 2018</h1>
      <nav>
        <ul>
          <li><Link to='/'>Home</Link></li>
          <li><Link to='/match-days/current'>Match day</Link></li>
          <li><Link to='/ranking'>Ranking</Link></li>
        </ul>
        <UserBox />
      </nav>
      <main>
        <Switch>

          <Route exact path='/' component={ Dashboard } />

          <Route path='/sign-up' component={ SignUp } />
          <Route path='/log-in' component={ LogIn } />

          <Route path='/tournaments/:id(\d+)' component={ Tournament } />
          <Route path='/match-days/:id(\d+)' component={ MatchDay } />
          <Route path='/ranking' component={ Ranking } />

          <Route component={ NotFound } />

        </Switch>
      </main>
    </div>
  </BrowserRouter>
