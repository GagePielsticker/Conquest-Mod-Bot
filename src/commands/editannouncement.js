const { Command } = require('./')

module.exports = class EditAnnounce extends Command {
  constructor (client) {
    super(client, ['editannouncement', 'editannounce'], 'Edit an announcement.', 3)
  }

  async run (msg, args) {
    const messageId = args[0]
    const content = args.splice(1).join(' ')
    const pingId = '633797656501682233'
    const channel = '597553655704453121'
    const role = msg.guild.roles.get(pingId)
    const message = await msg.guild.channels.get(channel).messages.fetch(messageId)
    const embed = message.embeds[0]
    if (!message) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Announcement Doesn\'t Exist'))
    role.setMentionable(true, `Announcement by ${msg.author.tag}`).then(() => {
      embed.setDescription(content)
      message.edit(message, embed)
    }).then(() => {
      msg.delete()
    })
  }
}
