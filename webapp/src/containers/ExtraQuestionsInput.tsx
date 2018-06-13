import * as React from 'react'
import { connect, Dispatch } from 'react-redux'
import { Link } from 'react-router-dom'

import { models as m } from '../types/models'
import { StoreState } from '../types'
import { deadlineHasPassed } from '../rules'
import { Localisable, withLocaliser } from '../locales'
import { Action } from '../actions'
import { Callbacks } from '../actions/base'
import {
  fetchExtraQuestions,
  postExtraQuestionBets
} from '../actions/data'
import {
  showMessage,
  hideMessage
} from '../actions/ui'
import { getUserId } from '../selectors/session'
import { makeGetUrlParameter } from '../selectors/util'
import { makeGetPool, makeGetExtraQuestionBetBucket } from '../selectors/Pool'
import {
  makeGetTournament,
  makeGetTeamsSorted,
  makeGetTeamsById
} from '../selectors/Tournament'

import { LazyLoadingComponent } from './LazyLoadingComponent'

interface Props extends Localisable {
  squadId: string
  tournamentId: string
  userId: string
  pool: m.Pool
  bets: m.ExtraQuestionBetBucket
  tournament: m.Tournament
  teams: m.Team[]
  teamsById: { [id: string]: m.Team }
  fetchExtraQuestions: (
    squadId: string, tournamentId: string, callbacks?: Callbacks) => void
  postExtraQuestionBets: (
      squadId: string, tournamentId: string,
      betBucket: m.ExtraQuestionUserBetBucket,
      callbacks?: Callbacks
    ) => void
  showMessage: (message: string) => void
  hideMessage: () => void
}

type State = { [answerKey: string]: m.IExtraQuestionBet }

class extraBetsInputPage extends LazyLoadingComponent<Props, State> {

  getRequiredProps() {
    return ['pool', 'tournament', 'teams', 'bets']
  }

  shouldRefreshOnMount() {
    let betBucket = this.props.bets
    let teams = this.props.teams
    return !betBucket.bets || !teams.length
  }

  requestData() {
    this.props.fetchExtraQuestions(
        this.props.squadId, this.props.tournamentId, this.requestDataCallbacks)
  }

  onRequestDataSuccess(): void {
    this.initAnswers()
    super.onRequestDataSuccess()
  }

  onMountWithNoRefreshNeeded() {
    this.initAnswers()
  }

  renderWithData() {
    let userId = this.props.userId
    if (!userId)
      return this.renderNoAccessPage()

    let pool = this.props.pool
    if (deadlineHasPassed(pool.extraQuestionsDeadline))
      return this.renderDeadlinePassedPage()

    let squadId = this.props.squadId
    let tournamentId = this.props.tournamentId
    let tournament = this.props.tournament
    let l = this.props.l
    let questions = this.props.pool.extraQuestions

    return (
      <div>
        <h1>
          { l(
            'EXTRA_QUESTIONS_INPUT_PAGE_TITLE', 'Edit your extra question bets'
          ) }
        </h1>
        <h2>{ l(tournament.name) } – #{squadId}</h2>
        { questions.map(q =>
          <div className="formRow" key={q.id}>
            <div className="formInput">
              { this.buildAnswerInputForm(q) }
            </div>
            <div className="formLabel">
              <div className="formLabelHead">
                { l(q.shortName) }
                {' – '}
                { l('AWARDED_POINTS', '{} points', q.awardedPoints) }
              </div>
              <div className="formLabelDetails">{ l(q.questionText) }</div>
            </div>
          </div>
        ) }
        <div className="formRow">
          <div className="formInput">
            <button onClick={this.submitBets}>
              { l('SUBMIT_EXTRA_BETS', 'Submit') }
            </button>
          </div>
        </div>
        { this.refreshComponent }
      </div>
    )
  }

  submitBets() {
    let bets: m.IExtraQuestionBet[] = []
    for (let i = 0; i < this.props.pool.extraQuestions.length; i++) {
      let q = this.props.pool.extraQuestions[i]
      let bet = this.state['answer-' + q.id]
      if (
        (!bet) ||
        (q.type == m.ExtraQuestionType.TEXT && !bet.text) ||
        (q.type == m.ExtraQuestionType.TEAM && !bet.teamId) ||
        (q.type == m.ExtraQuestionType.PLAYER && (!bet.teamId || !bet.playerId))
      ) {
        continue
      }
      bets.push(bet)
    }

    let showMessage = this.props.showMessage
    let hideMessage = this.props.hideMessage
    let l = this.props.l

    let betBucket = m.ExtraQuestionUserBetBucket.create({
      bets: bets, userId: this.props.userId })
    this.props.postExtraQuestionBets(
      this.props.squadId, this.props.tournamentId, betBucket,
      {
        onSuccess: () => {
          showMessage(
            l('EXTRA_BETS_STORED', 'Your extra question bets have been saved!'))
          setTimeout(hideMessage, 3000)
        }
      }
    )
  }

  buildAnswerInputForm(q: m.IExtraQuestion) {
    switch (q.type) {
      case m.ExtraQuestionType.TEAM:
        return this.buildTeamInputForm(q)
      case m.ExtraQuestionType.PLAYER:
        return this.buildPlayerInputForm(q)
      default:
        return this.buildTeamInputForm(q)
    }
  }

  buildTextInputForm(q: m.IExtraQuestion) {
    let answerKey = 'answer-' + q.id
    let self = this
    let updateAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
      let bet = m.ExtraQuestionBet.create({
          questionId: q.id, text: e.target.value })
      self.setState({ [answerKey]: bet })
    }
    let currentValue = ''
    if (this.state[answerKey] && this.state[answerKey].text)
      currentValue = this.state[answerKey].text
    return <input type="text" value={currentValue} onChange={updateAnswer} />
  }

  buildTeamInputForm(q: m.IExtraQuestion) {

    let answerKey = 'answer-' + q.id

    let self = this
    let updateAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
      let bet = m.ExtraQuestionBet.create({
          questionId: q.id, teamId: e.target.value })
      self.setState({ [answerKey]: bet })
    }

    let currentValue = ''
    if (this.state[answerKey] && this.state[answerKey].teamId)
      currentValue = this.state[answerKey].teamId
    let teams = this.props.teams || []
    let l = this.props.l

    return (
      <select value={currentValue} onChange={updateAnswer}>
        <option value="">{ l('SELECT_TEAM', '- Select a team -') }</option>
        { teams.map(team =>
          <option key={team.id} value={team.id}>{ l(team.name) }</option>
        ) }
      </select>
    )
  }

  buildPlayerInputForm(q: m.IExtraQuestion) {

    let answerKey = 'answer-' + q.id

    let currentTeamId = ''
    if (this.state[answerKey] && this.state[answerKey].teamId)
      currentTeamId = this.state[answerKey].teamId
    let currentPlayer = '0'
    if (this.state[answerKey] && this.state[answerKey].playerId)
      currentPlayer = '' + this.state[answerKey].playerId

    let self = this
    let selectTeam = (e: React.ChangeEvent<HTMLSelectElement>) => {
      let bet = m.ExtraQuestionBet.create({
          questionId: q.id, teamId: e.target.value, playerId: 0 })
      self.setState({ [answerKey]: bet })
    }
    let updateAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
      let playerId = parseInt(e.target.value)
      let bet = m.ExtraQuestionBet.create({
          questionId: q.id, teamId: currentTeamId, playerId: playerId })
      self.setState({ [answerKey]: bet })
    }

    let teams = this.props.teams || []
    let players: m.IPlayer[] = []
    if (currentTeamId) players = this.props.teamsById[currentTeamId].players
    players.sort((a: m.IPlayer, b: m.IPlayer) => {
      if (a.name < b.name) return -1;
      if (a.name > b.name) return 1;
      return 0;
    })
    let l = this.props.l

    let teamSelect =
      <select value={currentTeamId} onChange={selectTeam}>
        <option value="">{ l('SELECT_TEAM', '- Select a team -') }</option>
        { teams.map(team =>
          <option key={team.id} value={team.id}>{ l(team.name) }</option>
        ) }
      </select>

    let playerSelect = !currentTeamId ? null :
      <select value={currentPlayer} onChange={updateAnswer}>
        <option value="0">{ l('SELECT_PLAYER', '- Select a player -') }</option>
        { players.map(player =>
          <option key={player.id} value={player.id}>{player.name}</option>
        ) }
      </select>

    return (
      <div>
        <div>{ teamSelect }</div>
        <div>{ playerSelect }</div>
      </div>
    )
  }

  renderNoAccessPage() {
    let l = this.props.l
    return (
      <div>
        <p>
          { l('LOGIN_REQUIRED', 'You must be logged in to use this page.') }
        </p>
      </div>
    )
  }

  renderDeadlinePassedPage() {
    let l = this.props.l
    return (
      <div>
        <h1>{ l('EXTRA_QUESTIONS_DEADLINE_PASSED', 'Time\'s up!') }</h1>
        <p>
          { l(
            'EXTRA_QUESTIONS_DEADLINE_PASSED_TEXT',
            'The deadline has passed, you can not edit your answers any more.'
          ) }
        </p>
        <p>
          <Link to={'extra-questions-bets'}>
            { l(
              'EXTRA_QUESTIONS_LINK_TO_BETS',
              'Click here to see all bets that have been submitted.'
            ) }
          </Link>
        </p>
        { this.refreshComponent }
      </div>
    )
  }

  initAnswers() {
    let questions: m.IExtraQuestion[] = []
    if (this.props.pool && this.props.pool.extraQuestions)
      questions = this.props.pool.extraQuestions

    let bets = getUserBetsByQuestion(this.props.bets, this.props.userId)
    let changes: Partial<State> = {}
    for (let i = 0; i < questions.length; i++) {
      let question = questions[i]
      let qId = question.id
      if (this.state["answer-" + qId]) continue
      let bet = bets[qId] || m.ExtraQuestionBet.create({ questionId: qId })
      changes["answer-" + qId] = bet
    }
    this.setState(changes)
  }

  constructor(props: Props) {
    super(props)
    this.state = { }

    console.log("EQ Input constructing")

    this.initAnswers = this.initAnswers.bind(this)
    this.buildAnswerInputForm = this.buildAnswerInputForm.bind(this)
    this.buildTextInputForm = this.buildTextInputForm.bind(this)
    this.buildTeamInputForm = this.buildTeamInputForm.bind(this)
    this.buildPlayerInputForm = this.buildPlayerInputForm.bind(this)
    this.submitBets = this.submitBets.bind(this)
    this.renderNoAccessPage = this.renderNoAccessPage.bind(this)
    this.renderDeadlinePassedPage = this.renderDeadlinePassedPage.bind(this)
  }
}

function getUserBetsByQuestion(
    betBucket: m.ExtraQuestionBetBucket, userId: string
): m.IExtraQuestionBet[] {

  if (!userId) return []
  if (!betBucket || !betBucket.bets || !betBucket.bets.length) return []
  for (let i = 0; i < betBucket.bets.length; i++) {
    let userBucket = betBucket.bets[i]
    if (userBucket.userId != userId) continue
    let betsByQuestion: m.IExtraQuestionBet[] = []
    for (let j = 0; j < userBucket.bets.length; j++) {
      let bet = userBucket.bets[j]
      betsByQuestion[bet.questionId] = bet
    }
    return betsByQuestion
  }
  return []
}

const getTournamentIdFromUrl = makeGetUrlParameter('tournament_id')
const getSquadIdFromUrl = makeGetUrlParameter('squad_id')

const makeMapStateToProps = () => {
  return withLocaliser((state: StoreState, props: any) => {
    let getPool = makeGetPool(getSquadIdFromUrl, getTournamentIdFromUrl)
    let getTournament = makeGetTournament(getTournamentIdFromUrl)
    let getExtraQuestionBetBucket = makeGetExtraQuestionBetBucket(
        getSquadIdFromUrl,  getTournamentIdFromUrl)
    let getTeams = makeGetTeamsSorted(getTournamentIdFromUrl)
    let getTeamsById = makeGetTeamsById(getTeams)
    return {
      squadId: getSquadIdFromUrl(state, props),
      tournamentId: getTournamentIdFromUrl(state, props),
      pool: getPool(state, props),
      tournament: getTournament(state, props),
      userId: getUserId(state),
      bets: getExtraQuestionBetBucket(state, props),
      teams: getTeams(state, props),
      teamsById: getTeamsById(state, props),
    }
  })
}

const mapDispatchToProps = (dispatch: Dispatch<Action>) => {
  return {
    fetchExtraQuestions: (
        squadId: string,
        tournamentId: string,
        callbacks?: Callbacks
      ) => {
        dispatch(fetchExtraQuestions(squadId, tournamentId, callbacks))
      },
    postExtraQuestionBets: (
        squadId: string, tournamentId: string,
        betBucket: m.ExtraQuestionUserBetBucket,
        callbacks?: Callbacks
      ) => {
        dispatch(postExtraQuestionBets(
            squadId, tournamentId, betBucket, callbacks))
      },
    showMessage: (message: string) => { dispatch(showMessage(message)) },
    hideMessage: () => { dispatch(hideMessage()) },
  }
}

export default connect(
    makeMapStateToProps, mapDispatchToProps)(extraBetsInputPage)
