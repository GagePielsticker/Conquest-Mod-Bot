const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, ['ping', 'pong'], 'Get the response time of the bot.', 0)
  }

  async run (msg, args) {
    await msg.channel.send({
      embed: {
        description: `PONG \`${this.client.ws.ping}\`ms`,
        color: this.client.embedColor
      }
    })
  }
}
