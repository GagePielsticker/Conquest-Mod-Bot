const { Command } = require('./')

module.exports = class GetAnnounce extends Command {
  constructor (client) {
    super(client, ['getannouncement', 'getannounce'], 'Edit an announcement.', 3)
  }

  async run (msg, args) {
    const messageId = args[0]
    const channel = '597553655704453121'
    const message = await msg.guild.channels.get(channel).messages.fetch(messageId)
    if (!message) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Announcement Doesn\'t Exist'))
    msg.channel.send('```' + message.embeds[0].description + '```')
  }
}
