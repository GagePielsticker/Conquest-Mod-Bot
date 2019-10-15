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
client.conquestModerationHandlers = conquestModerationHandlers
client.conquestCouchDatabase = conquestCouchDatabase

// Event Handlers
client.on('message', (msg) => conquest.events.message(client, msg))
client.on('ready', () => conquest.events.ready(client))
client.on('guildMemberAdd', (member) => conquest.events.userJoin(client, member))

// Login
client.login(process.env.BOT_TOKEN)

// express rest api for commands page
// const app = require('express')()
// app.use('/', (req, res) => {
//   const commands = require('./').commands
//   res.json(commands)
// })
// app.listen(8877)
