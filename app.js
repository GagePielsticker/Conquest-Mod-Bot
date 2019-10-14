// configure .env
require('dotenv').config()
// Requirements
const conquest = require('./src')
const discord = require('discord.js')
const client = new discord.Client()

// Store some useful variable in the client object
client.conquest = conquest
client.embedColor = 0xb54747
client.convertTime = conquest.convertTime
client.discord = discord
client.evalUsers = process.env.EVAL_USERS.split(' ')
client.permissionCheck = conquest.permissionCheck
client.commands = new discord.Collection()

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
