const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, ['mute', 'm'], 'Mute a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to mute.'))
    const messageSplit = args.join(' ').split('|')
    const userId = args[0].replace(/[<@!>]+/, '')
    const reason = args.splice(1).join(' ')
    let muteTimer = -1
    if (messageSplit.length === 2) {
      if (!messageSplit[1] !== '') return
      muteTimer = await this.client.checkTime(messageSplit[1])
    }
    const member = await msg.guild.members.get(userId)
    if (!member) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    await member.roles.add(msg.guild.roles.find(r => r.name === 'Muted'))
    await this.client.conquestModLogHandler.addCase('Mute', userId, msg.author.id, reason, muteTimer)
  }
}
