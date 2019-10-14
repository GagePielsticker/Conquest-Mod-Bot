const Command = require('./')

module.exports = new Command.Command('ping', 'Get the response time of the bot.', (client, msg, args) => {
  msg.channel.send({
    embed: {
      description: `PONG! \`${client.ws.ping}ms\``,
      color: client.embedColor
    }
  })
}, 0)
