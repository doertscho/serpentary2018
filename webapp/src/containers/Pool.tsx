import * as React from 'react'
import { Link } from 'react-router-dom'
import { connect, Dispatch } from 'react-redux'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { deadlineHasPassed } from '../rules'
import { Action } from '../actions'
import { fetchPool, Callbacks, joinPool } from '../actions/data'
import { Localisable, withLocaliser, Localiser } from '../locales'
import { makeGetUrlParameter } from '../selectors/util'
import { getUserId } from '../selectors/session'
import { makeGetPool } from '../selectors/Pool'
import { makeGetTournament, makeGetMatchDays } from '../selectors/Tournament'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {
  squadId: string
  tournamentId: string
  pool: m.Pool
  tournament: m.Tournament
  matchDays: m.MatchDay[]
  userId: string
  fetchPool: (
    squadId: string, tournamentId: string, callbacks?: Callbacks) => void
  joinPool: (squadId: string, tournamentId: string) => void
}

const notLoggedInBox = (l: Localiser) =>
  <div>
    { l('LOG_IN_TO_JOIN_POOL', 'You need to sign up in order to join a pool') }
  </div>

const clickToJoinBox = (l: Localiser, onClick: () => void) =>
  <div onClick={onClick}>
    { l('CLICK_TO_JOIN_POOL', 'Click here to join this pool') }
  </div>

const alreadyMemberBox = (l: Localiser) =>
  <div>
    { l('ALREADY_PARTICIPANT_POOL', 'You are participating in this pool') }
  </div>

function extraQuestionsInputLink(pool: m.Pool, l: Localiser) {
  return (
    <div>
      <p>
        { l(
          'POOL_EXTRA_QUESTIONS_DEADLINE',
          'You can submit or edit your bets until {}.',
          l(pool.extraQuestionsDeadline, 'date-and-time')
        ) }
      </p>
      <p>
        <Link to={
              '/tournaments/' + pool.tournamentId +
              '/pools/' + pool.squadId +
              '/extra-questions-input'
            }>
          { l('POOL_EXTRA_QUESTION_INPUT_LINK', 'Go to the input form') }
        </Link>
      </p>
    </div>
  )
}

function extraQuestionsViewLink(pool: m.Pool, l: Localiser) {
  return (
    <div>
      <p>
        <Link to={
              '/tournaments/' + pool.tournamentId +
              '/pools/' + pool.squadId +
              '/extra-questions-bets'
            }>
          { l(
            'POOL_EXTRA_QUESTION_VIEW_LINK',
            'See the participants\'s answers'
          ) }
        </Link>
      </p>
    </div>
  )
}

function extraQuestionsBlock(pool: m.Pool, l: Localiser) {
  if (pool.extraQuestions && pool.extraQuestions.length) {
    let link = deadlineHasPassed(pool.extraQuestionsDeadline) ?
        extraQuestionsViewLink(pool, l) : extraQuestionsInputLink(pool, l)
    return (
      <div>
        <p>
          { l(
            'POOL_NUMBER_EXTRA_QUESTIONS',
            'There are {} extra questions to be answered for this pool.',
            pool.extraQuestions.length
          ) }
        </p>
        { link }
      </div>
    )
  } else {
    return (
      <p>
        { l('POOL_NO_EXTRA_QUESTIONS', 'This pool has no extra questions.')}
      </p>
    )
  }
}

function poolUserBox(
  pool: m.Pool,
  userId: string,
  joinPool: (squadId: string, tournamentId: string) => void,
  l: Localiser
) {
  if (!userId || !userId.length) {
    return notLoggedInBox(l)
  }
  if (!pool.participants || pool.participants.indexOf(userId) === -1) {
    return clickToJoinBox(l, () => joinPool(pool.squadId, pool.tournamentId))
  }
  return alreadyMemberBox(l)
}

class poolPage extends LazyLoadingComponent<Props, {}> {

  getRequiredProps() {
    return ['pool']
  }

  shouldRefreshOnMount() {
    let tournament = this.props.tournament
    return !tournament
  }

  requestData() {
    this.props.fetchPool(
        this.props.squadId, this.props.tournamentId, this.requestDataCallbacks)
  }

  renderWithData() {

    let pool = this.props.pool
    let userId = this.props.userId
    let joinPool = this.props.joinPool
    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let participants = pool.participants || []
    let matchDays = this.props.matchDays || []

    let tournamentName: string | m.ILocalisableString = tournamentId
    if (this.props.tournament && this.props.tournament.name) {
      tournamentName = this.props.tournament.name
    }

    let l = this.props.l

    return (
      <div>
        <h1>{ l('POOL_PAGE_TITLE', 'Pool details') }</h1>
        <h2>{ l(tournamentName) } – #{squadId}</h2>
        { poolUserBox(pool, userId, joinPool, l) }
        <h3>{ l('POOL_EXTRA_QUESTIONS', 'Extra questions') }</h3>
        { extraQuestionsBlock(pool, l) }
        <h3>{ l('POOL_MATCH_DAYS', 'Jump to the bets by match day') }</h3>
        <ul>
          { matchDays.map(matchDay =>
            <li key={matchDay.id}>
              <Link to={
                    '/tournaments/' + tournamentId +
                    '/match-days/' + matchDay.id +
                    '/bets/' + squadId
                  }>{ l(matchDay.name) }</Link>
            </li>
          )}
        </ul>
        <h3>{ l('POOL_PARTICIPANTS', 'Users participating in this pool') }</h3>
        <ul>
          { participants.map(userId =>
            <li key={userId}>{userId}</li>
          )}
        </ul>
        { this.refreshComponent }
      </div>
    )
  }
}

const getSquadIdFromUrl = makeGetUrlParameter('squad_id')
const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')

const makeMapStateToProps = () => {
  let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
  let getTournament = makeGetTournament(getTournamentIdFromUrl)
  let getMatchDays = makeGetMatchDays(getTournamentIdFromUrl)
  return withLocaliser((state: StoreState, props: any) => {
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      pool: getPool(state, props),
      tournament: getTournament(state, props),
      matchDays: getMatchDays(state, props),
      userId: getUserId(state)
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchPool: (
        squadId: string,
        tournamentId: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchPool(squadId, tournamentId, callbacks))
      },
    joinPool: (squadId: string, tournamentId: string) => {
      dispatch(joinPool(squadId, tournamentId))
    }
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(poolPage)
