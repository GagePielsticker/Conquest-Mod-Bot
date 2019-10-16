// configure .env
require('dotenv').config()
// Requirements
const conquest = require('./src')
const discord = require('discord.js')
const client = new discord.Client()
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

// client functions that will be used more than once [ Saving the copy paste drama ] // Feel free to clean this up with a PR
client.getMultiplier = async (timeSpan) => {
  switch (timeSpan) {
    case ['month', 'months'].includes(timeSpan.toLowerCase()):
      return 2629746
    case ['d', 'days', 'day'].includes(timeSpan.toLowerCase()):
      return 86400
    case ['hr', 'hrs', 'hour', 'hours'].includes(timeSpan.toLowerCase()):
      return 3600
    case ['m', 'min', 'mins', 'minute', 'minutes'].includes(timeSpan.toLowerCase()):
      return 60
  }
}

client.checkTime = async (timeAbbreviation) => {
  const times = timeAbbreviation.split(',')
  let totalTime = 0
  times.map(time => {
    totalTime += (Number.parseInt(/[aA-zZ]+/g) * client.getMultiplier(time.replace(/[0-9]+/g, '')))
  })
  return totalTime
}

// Event Handlers
client.on('message', (msg) => conquest.events.message(client, msg))
client.on('ready', () => conquest.events.ready(client))
client.on('guildMemberAdd', (member) => conquest.events.userJoin(client, member))
client.on('guildMemberRemove', (member) => conquest.events.moderation.userKicked(client, member))
client.on('guildBanAdd', (guild, user) => conquest.events.moderation.userBanned(client, user))

// starboard events
client.on('messageReactionAdd', () => conquest.events.ready(client))
client.on('messageReactionRemove', () => conquest.events.ready(client))

// Login
client.login(process.env.BOT_TOKEN)

// express rest api for commands page
// const app = require('express')()
// app.use('/', (req, res) => {
//   const commands = require('./').commands
//   res.json(commands)
// })
// app.listen(8877)
