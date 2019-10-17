// configure .env
require('dotenv').config()
// Requirements
const conquest = require('./src')
const discord = require('discord.js')
const client = new discord.Client({
  partials: ['MESSAGE'],
  messageCacheMaxSize: 500,
  fetchAllMembers: true,
  presence: {
    status: 'online',
    activity: {
      type: 'WATCHING',
      name: 'Conquest'
    }
  }
})
const conquestModerationHandlers = require('./src/database/')

// Load the database
const { DATABASE_USER, DATABASE_PASS, DATABASE_IP, DATABASE_PORT } = process.env
const couch = require('nano')(`http://${DATABASE_USER}:${DATABASE_PASS}@${DATABASE_IP}:${DATABASE_PORT}`)
const conquestCouchDatabase = couch.use('conquest')

// Store some useful variable in the client object
client.conquest = conquest
client.embedColor = 0xb54747
client.convertTime = conquest.convertTime
client.discord = discord
client.evalUsers = process.env.EVAL_USERS.split(' ')
client.permissionCheck = conquest.permissionCheck
client.commands = new discord.Collection()
client.conquestModLogHandler = new conquestModerationHandlers.Modlog(client)
client.conquestCouchDatabase = conquestCouchDatabase
client.starboard = new conquest.events.Starboard(client)

// client functions that will be used more than once [ Saving the copy paste drama ] // Feel free to clean this up with a PR
function getMultiplier (timeSpan) {
  if (['month', 'months'].includes(timeSpan)) return 2629746
  if (['d', 'days', 'day'].includes(timeSpan)) return 89600
  if (['hr', 'hrs', 'hour', 'hours'].includes(timeSpan)) return 3600
  if (['m', 'min', 'mins', 'minute', 'minutes'].includes(timeSpan)) return 60
}

client.checkTime = async (timeAbbreviation) => {
  const times = timeAbbreviation.split(',')
  const totalTime = times.map(time => {
    const timeTxt = time.replace(/[0-9]+/g, '').toLowerCase()
    const multi = getMultiplier(timeTxt)
    const numbers = time.replace(/[aA-zZ]+/g, '')
    const initialTime = Number.parseInt(numbers)
    return (initialTime * multi)
  })
  return totalTime.reduce((a, b) => a + b, 0)
}

// Unmute Interval
async function runUnmute (client) {
  const { mutes } = await client.conquestCouchDatabase.get('mutes')
  const userIds = Object.keys(mutes)
  userIds.map(async userId => {
    const mute = mutes[userId]
    if (mute.unmuteTime <= Date.now()) {
      await client.conquestModLogHandler.removeMute(userId)
      const member = await client.guilds.get('597553336044224522').members.fetch(userId)
      await member.roles.remove('632686943758712862')
    }
  })
}
setInterval(async () => {
  await runUnmute(client)
}, 5000)

// Event Handlers
client.on('message', (msg) => conquest.events.message(client, msg))
client.on('ready', () => conquest.events.ready(client))
client.on('guildMemberAdd', (member) => conquest.events.userJoin(client, member))
client.on('guildMemberRemove', (member) => {
  const time = new Date().getTime()
  conquest.events.moderation.userLeaveorKicked(client, member, member.guild, time)
})

client.on('guildBanAdd', (guild, user) => {
  const time = new Date().getTime()
  conquest.events.moderation.userBanned(client, user, guild, time)
})

// starboard events
const Starboard = new conquest.events.Starboard(client)
client.on('messageReactionAdd', async (msgReaction, user) => {
  if (msgReaction.message.partial) await msgReaction.message.fetch()
  if (msgReaction.emoji.toString() === '⭐') {
    await Starboard.starAdded(msgReaction.message, user, msgReaction)
  }
})
client.on('messageReactionRemove', async (msgReaction, user) => {
  if (msgReaction.message.partial) await msgReaction.message.fetch()
  if (user.id === client.user.id) return
  if (msgReaction.emoji.toString() === '⭐') {
    await Starboard.starRemoved(msgReaction.message, user, msgReaction)
  }
})

// Login
client.login(process.env.BOT_TOKEN)

// express rest api for commands page
// const app = require('express')()
// app.use('/', (req, res) => {
//   const commands = require('./').commands
//   res.json(commands)
// })
// app.listen(8877)
