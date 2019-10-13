/**
 * @var timeInSeconds The amount of time in seconds
 */
module.exports = (timeInSeconds) => {
  timeInSeconds = Number(timeInSeconds)
  const years = Math.floor(timeInSeconds / 31556952)
  const months = Math.floor((timeInSeconds / 2592000) % 12)
  const days = Math.floor((timeInSeconds / 86400) % 7)
  const hrs = Math.floor((timeInSeconds / 3600) % 24)
  const mins = Math.floor(timeInSeconds % 3600 / 60)
  const secs = Math.floor(timeInSeconds % 60)

  const output = []
  if (years) output.push(`${years.toString()} Year(s)`)
  if (months) output.push(`${months.toString()} Month(s)`)
  if (days) output.push(`${days.toString()} Day(s)`)
  if (hrs) output.push(`${hrs.toString()} Hour(s)`)
  if (mins) output.push(`${mins.toString()} Min(s)`)
  if (secs) output.push(`${secs.toString()} Second(s)`)

  return output.join(', ')
}
