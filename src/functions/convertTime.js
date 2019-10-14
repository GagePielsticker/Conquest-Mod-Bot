/**
 * @var timeInSeconds The amount of time in seconds
 */
module.exports = (timeInSeconds) => {
  timeInSeconds = Number(timeInSeconds)
  const years = Math.floor(timeInSeconds / 31556952000)
  const months = Math.floor((timeInSeconds / 2592000000) % 12)
  const days = Math.floor((timeInSeconds / 86400000) % 7)
  const hrs = Math.floor((timeInSeconds / 3600000) % 24)
  const mins = Math.floor(timeInSeconds % 3600000 / 60000)
  const secs = Math.floor((timeInSeconds / 1000) % 60)

  var output = []
  if (years > 0) output.push(`${years.toString()} Year(s)`)
  if (months > 0) output.push(`${months.toString()} Month(s)`)
  if (days > 0) output.push(`${days.toString()} Day(s)`)
  if (hrs > 0) output.push(`${hrs.toString()} Hour(s)`)
  if (mins > 0) output.push(`${mins.toString()} Min(s)`)
  if (secs > 0) output.push(`${secs.toString()} Second(s)`)
  return output.join(', ')
}
