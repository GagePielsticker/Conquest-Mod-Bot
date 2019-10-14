// configure .env
require('dotenv').config()
// load src
const conquest = require('./src')
// require discord
const discord = require('discord.js')
// define client
const client = new discord.Client()
// define conquest variable as a part of client
client.conquest = conquest
// define the embed color in client
client.embedColor = 0xb54747
// define convertTime function in client
client.convertTime = conquest.convertTime
// store discord module in client
client.discord = discord
// store eval user ids in an array on client object
client.evalUsers = process.env.EVAL_USERS.split(' ')
// store permissionCheck in client
client.permissionCheck = conquest.permissionCheck
// message event handler
client.on('message', (msg) => conquest.events.message(client, msg))

// ready event handler
client.on('ready', () => conquest.events.ready(client))

// new guild member event handler
client.on('guildMemberAdd', (member) => conquest.events.userJoin(client, member))

// Login
client.login(process.env.BOT_TOKEN)
