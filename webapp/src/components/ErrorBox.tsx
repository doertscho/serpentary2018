import * as React from 'react'

export interface Props {
  message?: string
}

export const ErrorBox = ({ message }: Props) => {
  if (message && message.length > 0)
    return (
      <div>
        <strong>{ message }</strong>
      </div>
    )
  else
    return null
}
