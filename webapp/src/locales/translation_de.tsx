import { Translation } from './base'

const translation_de: Translation = {

  // enum names
  FINAL: 'Finale',
  MATCH_FOR_THIRD_PLACE: 'Dritter Platz',
  SEMI_FINAL: 'Halbfinale',
  QUARTER_FINAL: 'Viertelfinale',
  EIGHTH_FINAL: 'Achtelfinale',

  // page-wide
  REFRESH: 'Daten neu laden',

  // navigation links
  NAV_HOME: 'Start',
  NAV_RULES: 'Regeln',
  NAV_STATISTICS: 'Statistik',
  NAV_BETS: 'Tipps',
  NAV_RANKING: 'Rangliste',
  NAV_EXTRA_QUESTIONS: 'Sondertipps',

  // user box
  GREETING: 'Hallo, {}!',
  GREETING_GUEST: 'Hallo, unbekannte Entität!',
  EDIT_PROFILE_SETTINGS: 'Profil und Einstellungen',
  LOG_IN: 'Anmelden',
  LOG_OUT: 'Abmelden',
  SIGN_UP: 'Registrieren',
  SIGN_UP_SUCCESS:
    'Vielen Dank, {}, deine Registrierung war erfolgreich. ' +
    'Bitte bestätige deine E-Mail-Adresse, oder gib mir Bescheid, ' +
    'damit ich deinen Account freischalten kann.' ,

  // log in and sign up
  LOG_IN_PAGE_TITLE: 'Anmeldung',
  SIGN_UP_PAGE_TITLE: 'Registrierung',
  LOG_IN_USER_ID_LABEL_HEAD: 'Wer da?',
  LOG_IN_USER_ID_LABEL_DETAIL:
    'Nutze deine Account-ID, deinen Anzeigenamen ' +
    'oder deine E-Mail-Adresse zur Anmeldung.',
  LOG_IN_PASSWORD_LABEL_HEAD: 'Dein Passwort',
  SIGN_UP_USER_ID_LABEL_HEAD: 'Wähle eine Account-ID',
  SIGN_UP_USER_ID_LABEL_DETAIL:
    'Unter diesem "Namen" wird dich die Datenbank kennen – ' +
    'nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt. ' +
    'Keine Sorge, du kannst später einen Anzeigenamen wählen.',
  SIGN_UP_PASSWORD_LABEL_HEAD: 'Wähle dein Passwort',
  SIGN_UP_PASSWORD_LABEL_DETAIL:
    'Verwende mindestens acht Zeichen und mindestens ' +
    'je einen Kleinbuchstaben, einen Großbuchstaben und eine Zahl.',
  SIGN_UP_PASSWORD_CHECK_LABEL_HEAD: 'Bitte wiederhole dieses Passwort',
  SIGN_UP_EMAIL_LABEL_HEAD: 'Deine E-Mail-Adresse – wenn du möchtest',
  SIGN_UP_EMAIL_LABEL_DETAIL:
    'Gib eine E-Mail-Adresse an, ' +
    'an die ein Link zur Bestätigung geschickt wird. ' +
    'Dies ist optional, allerdings musst du mir andernfalls Bescheid geben ' +
    'und warten, bis ich deinen Account manuell aktiviert habe.',
  SIGN_UP_BUTTON: 'Bin dabei!',

  // dashboard page
  DASHBOARD_PAGE_TITLE: 'Übersicht',
  DASHBOARD_INTRO_TEXT:
    'Willkommen bei dieser kleinen Tippspiel-App. ' +
    'Um einer Tipprunde und ihren Tippspielen beizutreten, ' +
    'muss jemand den direkten Link zu dessen Seite mit dir teilen. ' +
    'Mehr Informationen findest du unter "Regeln".',
  DASHBOARD_SUGGESTIONS_TEXT:
    'Diese Übersichtsseite sieht derzeit recht leer aus. ' +
    'Vorschläge, was diese Seite nützlicher machen könnte, ' +
    'kannst du jederzeit über das Ticketsystem des Projekts übermitteln. ' +
    'Dieses erreichst du über das Käfer-Icon in der oberen Navigation.',
  DASHBOARD_TOURNAMENTS: 'Derzeit aktive Wettbewerbe',

  // tournament details page
  TOURNAMENT_PAGE_TITLE: 'Wettbewerbsinfo',
  TOURNAMENT_MATCH_DAYS: 'Spieltage in diesem Wettbewerb',

  // match day details page
  MATCH_DAY_PAGE_TITLE: 'Spieltagsinfo',
  MATCH_DAY_MATCHES: 'Spiele an diesem Spieltag',
  MATCH_DAY_SQUADS: 'Tipps für diesen Spieltag',

  // match day bets page
  MATCH_DAY_BETS_PAGE_TITLE: 'Spieltag: Tipps',
  MATCH_DAY_BETS_BY_SQUAD: 'Prognosen der Tipprunde #{}',
  COUNTDOWN_CLOSED: 'geschlossen!',

  // squad page
  SQUAD_PAGE_TITLE: 'Tipprunde',
  SQUAD_POOLS: 'Angebotene Wettbewerbe dieser Tipprunde',
  SQUAD_MEMBERS: 'Mitglieder dieser Tipprunde',
  LOG_IN_TO_JOIN:
    'Du musst dich anmelden, um einer Tipprunde beitreten zu können',
  CLICK_TO_JOIN: 'Klicke hier, um dieser Tipprunde beizutreten',
  ALREADY_MEMBER: 'Du bist Mitglied dieser Tipprunde',

  // pool page
  POOL_PAGE_TITLE: 'Tippspiel',
  POOL_EXTRA_QUESTIONS: 'Zusatzfragen',
  POOL_NO_EXTRA_QUESTIONS:
    'Zu diesem Tippspiel wurden keine Zusatzfragen erstellt',
  POOL_NUMBER_EXTRA_QUESTIONS: 'Dieses Tippspiel definiert {} Zusatzfragen',
  POOL_EXTRA_QUESTION_VIEW_LINK: 'Abgegebene Antworten ansehen',
  POOL_EXTRA_QUESTIONS_DEADLINE:
    'Du kannst deine Antworten einreichen oder bearbeiten bis {}',
  POOL_EXTRA_QUESTION_INPUT_LINK: 'Zum Eingabeformular',
  POOL_MATCH_DAYS: 'Tipps nach Spieltag',
  POOL_PARTICIPANTS: 'Teilnehmende Mitglieder',
  LOG_IN_TO_JOIN_POOL:
    'Du musst dich anmelden, um dich für ein Tippsiel registrieren zu können',
  CLICK_TO_JOIN_POOL:
    'Klicke hier, um dich für dieses Tippspiel zu registrieren',
  ALREADY_PARTICIPANT_POOL: 'Du nimmst an diesem Tippspiel teil',

  // extra bets input
  EXTRA_QUESTIONS_INPUT_PAGE_TITLE: 'Zusatzfragen',
  SELECT_TEAM: '- Wähle ein Team -',
  SELECT_PLAYER: '- Wähle einen Spieler -',
  AWARDED_POINTS: '{} Punkte',
}

export default translation_de
