import * as React from 'react'

interface Props {
  userId?: string
  userName?: string
}

function hashString(input: string): number {
  if (input.length == 0) return 240
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    let char = input.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  if (hash < 0) return -1 * hash
  return hash
}

function toHexPadded(num: number): string {
  if (num < 16) return '0' + num.toString(16)
  return num.toString(16)
}

function makeColors(userId: string): { backgroundColor: string, color: string} {
  let hash = hashString(userId + userId.toUpperCase() + userId.toLowerCase())
  let red = (hash % 1886) % 255
  let blue = (hash % 1905) % 255
  let green = (hash % 1882) % 255

  let backgroundColor =
      '#' + toHexPadded(red) + toHexPadded(blue) + toHexPadded(green)

  let textColor = '#fff'
  if (red > 160 && blue > 160 && green > 160) textColor = '#000'

  return {
    backgroundColor: backgroundColor,
    color: textColor
  }
}

export default (props: Props) => {
  let userId = props.userId || ''
  let userName = props.userName || userId
  return (
    <div className="userIcon" style={makeColors(userId)} title={userName}>
      { userName.substring(0, 1).toUpperCase() }
    </div>
  )
}
