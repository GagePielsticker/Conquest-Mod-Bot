const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, ['unmute', 'um'], 'Unmute a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to unmute.'))
    const userId = args[0].replace(/[<@!>]+/, '')
    const member = await msg.guild.members.get(userId)
    if (!member) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    await this.client.conquestModLogHandler.removeMute(userId)
    await member.roles.remove(msg.guild.roles.find(r => r.name === 'Muted'))
  }
}
