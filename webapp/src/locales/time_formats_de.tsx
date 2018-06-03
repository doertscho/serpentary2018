import { TimeFormats } from './base'

const padded = (n: number) => n < 10 ? '0' + n : '' + n

const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const wd = (n: number) => days[n]

const months = [
  'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun',
  'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'
]
const mo = (n: number) => months[n]

const date = (d: Date) => {
  let dn = wd(d.getDay())
  let mn = mo(d.getMonth())
  return dn + ', ' + d.getDate() + '. ' + mn
}

const time = (d: Date) => {
  let h = padded(d.getHours())
  let m = padded(d.getMinutes())
  return h + ':' + m + ' Uhr'
}

const dateAndTime = (d: Date) => date(d) + ', ' + time(d)

const time_formats_de: TimeFormats = {
  'date': date,
  'time': time,
  'date-and-time': dateAndTime,
}

export default time_formats_de
