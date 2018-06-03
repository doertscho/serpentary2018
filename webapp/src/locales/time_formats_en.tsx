import { TimeFormats } from './base'

const padded = (n: number) => n < 10 ? '0' + n : '' + n
const hours12 = (n: number) => n > 12 ? n - 12 : n
const ampm = (n: number) => n < 12 ? 'am' : 'pm'

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const wd = (n: number) => days[n]

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]
const mo = (n: number) => months[n]

const date = (d: Date) => {
  let dn = wd(d.getDay())
  let mn = mo(d.getMonth())
  return dn + ', ' + d.getDate() + ' ' + mn
}

const time = (d: Date) => {
  let h = d.getHours()
  let m = padded(d.getMinutes())
  return hours12(h) + ':' + m + ampm(h)
}

const dateAndTime = (d: Date) => date(d) + ', ' + time(d)

const time_formats_en: TimeFormats = {
  'date': date,
  'time': time,
  'date-and-time': dateAndTime,
}

export default time_formats_en
