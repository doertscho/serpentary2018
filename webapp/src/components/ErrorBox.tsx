import * as React from 'react'

interface Props {
  message?: string
}

export default ({ message }: Props) => {
  if (message && message.length > 0)
    return (
      <div>
        <strong>{ message }</strong>
      </div>
    )
  else
    return null
}
