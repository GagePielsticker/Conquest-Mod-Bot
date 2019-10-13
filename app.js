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
client.embedColor = 0xb545747
// define convertTime function in client
client.convertTime = conquest.convertTime

// ready event handler
client.on('ready', conquest.events.ready)

// new guild member event handler
client.on('guildMemberAdd', conquest.events.userJoin)

// Login
client.login(process.env.BOT_TOKEN)
