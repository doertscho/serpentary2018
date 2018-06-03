import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { StoreState } from '../types'
import { Localisable, withLocaliser } from '../locales'
import {
  getCurrentSquadId,
  getCurrentTournamentId,
  getCurrentMatchDayId
} from '../selectors/Navigation'

interface Props extends Localisable {
  squadId: string
  tournamentId: string
  matchDayId: string
}

class navigationView extends React.Component<Props, {}> {

  render() {
    let l = this.props.l
    return (
      <nav className="nav">
        <div className="primaryNav">
          <ul>
            <li>
              <Link to={'/'}>{ l('NAV_HOME', 'Home')}</Link>
            </li>
            <li>
              <Link to={'/rules'}>{ l('NAV_RULES', 'Rules') }</Link>
            </li>
            <li>
              <Link to={'/statistics'}>
                { l('NAV_STATISTICS', 'Statistics') }
              </Link>
            </li>
            <li>
              <a href="https://github.com/doertscho/serpentary2018/issues">
                <i className="fas fa-bug"></i>
              </a>
            </li>
          </ul>
        </div>
        <div className="secondaryNav">
          { this.renderSecondaryNav() }
        </div>
      </nav>
    )
  }

  renderSecondaryNav() {
    if (this.props.squadId && this.props.tournamentId) {
      return this.renderFullSecondaryNav()
    }
    if (this.props.tournamentId) {
      return this.renderTournamentSecondaryNav()
    }
    return null
  }

  renderFullSecondaryNav() {
    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let matchDayId = this.props.matchDayId
    let l = this.props.l
    return (
      <ul>
        <li>
          <Link to={'/squads/' + squadId}>#{squadId}</Link>
        </li>
        <li>
          <Link to={
            '/tournaments/' + tournamentId +
            '/match-days/' + matchDayId +
            '/bets/' + squadId
          }>
            { l('NAV_BETS', 'Bets') }
          </Link>
        </li>
        <li>
          <Link to={
            '/tournaments/' + tournamentId +
            '/pools/' + squadId
          }>
            { l('NAV_RANKING', 'Ranking') }
          </Link>
        </li>
        <li>
          <Link to={
            '/tournaments/' + tournamentId +
            '/pools/' + squadId +
            '/extra-questions-input'
          }>
            { l('NAV_EXTRA_QUESTIONS', 'Extra bets') }
          </Link>
        </li>
      </ul>
    )
  }

  renderTournamentSecondaryNav() {
    let tournamentId = this.props.tournamentId
    let l = this.props.l
    return (
      <ul>
        <li>
          <Link to={'/tournaments/' + tournamentId}>
            #{tournamentId}
          </Link>
        </li>
      </ul>
    )
  }
}

const mapStateToProps = withLocaliser((state: StoreState, props: any) => {
  return {
    squadId: getCurrentSquadId(state),
    tournamentId: getCurrentTournamentId(state),
    matchDayId: getCurrentMatchDayId(state)
  }
})

export default connect(mapStateToProps)(navigationView)
