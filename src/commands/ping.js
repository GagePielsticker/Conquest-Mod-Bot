const { Command } = require('./')

module.exports = new Command('ping', ['pong'], 'Get the response time of the bot.', (client, msg, args) => {
  msg.channel.send({
    embed: {
      description: `PONG! \`${client.ws.ping}ms\``,
      color: client.embedColor
    }
  })
}, 0)
