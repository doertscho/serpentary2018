import * as React from 'react'

interface Props {
  teamId?: string
  teamName?: string
}

export default (props: Props) => {
  let teamName = props.teamName || props.teamId
  let teamId = props.teamId || '_unkown'
  let style = { backgroundImage: 'url("/emblems/' + teamId + '.svg")' }
  return (
    <div className="teamIcon" style={style} title={teamName}>
    </div>
  )
}
