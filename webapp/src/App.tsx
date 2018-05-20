import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from './types'
import { Action } from './actions'
import { initSession } from './actions/session'
import { isInitialised } from './selectors'

import UserBox from './containers/UserBox'
import Navigation from './containers/Navigation'
import Dashboard from './containers/Dashboard'
import SignUp from './containers/SignUp'
import LogIn from './containers/LogIn'
import Tournament from './containers/Tournament'
import MatchDay from './containers/MatchDay'
import MatchDayBets from './containers/MatchDayBets'
import Ranking from './containers/Ranking'
import Squad from './containers/Squad'
import NotFound from './components/NotFound'

interface Props {
  isInitialised: boolean
  initApp: () => void
}

const ID = '([0-9a-z-]+)'

class App extends React.Component<Props, any> {

  render() {
    if (!this.props.isInitialised)
      return <div>Initialising ...</div>

    return (
      <BrowserRouter>
        <div className='page-container'>
          <h1>serpentary 2018</h1>
          <nav>
            <Navigation />
            <UserBox />
          </nav>
          <main>
            <Switch>

              <Route exact path='/' component={ Dashboard } />

              <Route path='/sign-up' component={ SignUp } />
              <Route path='/log-in' component={ LogIn } />

              <Route path={
                    '/tournaments/:tournament_id' + ID +
                    '/match-days/:match_day_id' + ID +
                    '/bets/:squad_id' + ID
                  }
                  component={ MatchDayBets } />

              <Route path={
                    '/tournaments/:tournament_id' + ID +
                    '/match-days/:match_day_id' + ID +
                    '/ranking/:squad_id' + ID
                  }
                  component={ Ranking } />

              <Route path={
                    '/tournaments/:tournament_id' + ID +
                    '/match-days/:match_day_id' + ID
                  }
                  component={ MatchDay } />

              <Route path={'/tournaments/:tournament_id' + ID}
                  component={ Tournament } />

              <Route path={'/squads/:squad_id' + ID}
                  component={ Squad } />

              <Route component={ NotFound } />

            </Switch>
          </main>
        </div>
      </BrowserRouter>
    )
  }

  componentWillMount() {
    this.props.initApp()
  }
}

const mapStateToProps = (state: StoreState) => {
  return {
    isInitialised: isInitialised(state)
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    initApp: () => {
      dispatch(initSession())
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
