import * as React from 'react'

import { localisableComponent, Localisable } from '../locales'

const statisticsView = (props: Localisable) => {
  let l = props.l
  return (
    <div>
      <h1>{ l('STATISTICS_PAGE_TITLE', 'Statistics') }</h1>
      <h2>{ l('STATISTICS_REQUEST_NEW_HEAD', 'Request new statistics') }</h2>
      <p>
        { l('STATISTICS_REQUEST_NEW_TEXT',
          'What kinds of additional statistics would you like to see here? ' +
          'Who scored most points for matches that are played on a Tuesday? ' +
          'Who predicts the highest average number of goals? ' +
          'Which team is your personal lucky charm and won you most points? ' +
          'You can request anything through the project\'s issue tracker ' +
          'which you can access via the little bug icon at the top.'
        ) }
      </p>
    </div>
  )
}

export default localisableComponent(statisticsView)
