const { Command } = require('./')

module.exports = class Mute extends Command {
  constructor (client) {
    super(client, ['mute', 'm'], 'Mute a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to mute.'))
    const messageSplit = args.join(' ').split('|')
    const userId = args[0].replace(/[<@!>]+/g, '')
    const reason = args.splice(1).join(' ')
    let muteTimer = 'perm'
    if (messageSplit.length === 2) {
      if (messageSplit[1] !== '') muteTimer = await this.client.checkTime(messageSplit[1].trim())
    }
    const member = await msg.guild.members.get(userId)
    if (!member) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    await member.roles.add(msg.guild.roles.find(r => r.name === 'Muted'))
    await this.client.conquestModLogHandler.addCase('Mute', userId, msg.author.id, reason, muteTimer)
    await msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`:zipper_mouth: User <@${userId}> muted`))
  }
}
