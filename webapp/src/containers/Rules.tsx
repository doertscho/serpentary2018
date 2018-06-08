import * as React from 'react'

import { localisableComponent, Localisable } from '../locales'

const rulesView = (props: Localisable) => {
  let l = props.l
  return (
    <div>
      <h1>{ l('RULES_PAGE_TITLE', 'Rules') }</h1>
      <h2>{ l('RULES_SIGNING_UP_HEAD', 'Signing up and joining a squad') }</h2>
      <p>
        { l('RULES_SIGNING_UP_TEXT',
          'To join a pool, you first need to create an account. ' +
          'You\'ll then be able to join a squad ' +
          'and see for which tournaments it is currently offering pools. ' +
          'In order to join a squad, ' +
          'someone must share the link to the squad\'s page with you. ' +
          'Visit that page and click the prominent button to join the squad.'
        ) }
      </p>
      <h2>{ l('RULES_SUBMITTING_BETS_HEAD', 'Submitting your bets') }</h2>
      <p>
        { l('RULES_SUBMITTING_BETS_TEXT',
          'Once you have joined a squad and signed up for one of its pools, ' +
          'you can submit your bets for the upcoming matches. ' +
          'Go to your squad\'s page and follow the links, ' +
          'or jump to the bets overview page directly by clicking the link ' +
          'which (hopefully) will show up in the navigation bar at the top. ' +
          'You can submit your bet for any game ' +
          'until five minutes before kick off. ' +
          'Click the highlighted cell in your row ' +
          'that corresponds to the match.' +
          'This will open the input dialogue. ' +
          'Activate your inner Nostradamus, ' +
          'set the numbers according to what you think will happen, ' +
          'and hit submit to store your bet.'
        ) }
      </p>
      <h2>
        { l('RULES_SUBMITTING_EXTRA_BETS_HEAD',
          'Submitting your extra question bets'
        ) }
      </h2>
      <p>
        { l('RULES_SUBMITTING_EXTRA_BETS_TEXT',
          'Most pools will also offer a couple of extra questions ' +
          'which you can answer before the tournament begins. ' +
          'If it turns out in the end ' +
          'that you have chosen wisely for any of these, ' +
          'you can strike some bonus points for the final ranking. ' +
          'Again, you can access the input form for these ' +
          'by following the links on your squad\'s page ' +
          'or through the quick link at the top.'
        ) }
      </p>
      <h2>{ l('RULES_SCORING_SYSTEM_HEAD', 'Scoring system') }</h2>
      <p>
        { l('RULES_SCORING_SYSTEM_TEXT',
          'When a match is over, ' +
          'the actual result will be compared to your prediction. ' +
          'If you got the right tendency ' +
          '(that is, win, lose, or draw; ' +
          'for example, your bet was 3:1 and the game ended 1:0) ' +
          'three points will be added to your score. ' +
          'If you got the correct goal difference as well ' +
          '(for example, your bet was 3:0 and the game ended 4:1), '
          'you\'ve earned yourself another point ' +
          'and the match is worth four for you (except for draws). ' +
          'If you predicted the exact outcome of the match correctly, ' +
          'you get the maximum of five points for this match. '
        ) }
      </p>
      <p>
        { l('RULES_SCORING_SYSTEM_KO_TEXT',
          'Matches in the knockout stages will give you additional points ' +
          'if you predict them well. ' +
          'For any matches that go to extra time or penalties, ' +
          'the scoreline after 90 minutes will be the one that\'s relevant. ' +
          'So even for knockout matches, ' +
          'it may make sense to bet on a draw ' +
          'if you think it will be tightly contested.'
        ) }
      </p>
    </div>
  )
}

export default localisableComponent(rulesView)
