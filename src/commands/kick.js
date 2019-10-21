const { Command } = require('./')

module.exports = class Kick extends Command {
  constructor (client) {
    super(client, ['kick', 'k'], 'Kick a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to kick.'))
    const userId = args[0].replace(/[<@!>]+/g, '')
    const reason = args.splice(1).join(' ')
    const member = await msg.guild.members.get(userId)
    if (!member) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    if (this.client.permissionCheck(this.client, member) >= 1) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('You can not use me to kick your peers. :eyes:'))
    member.kick(reason)
    await this.client.conquestModLogHandler.addCase('Kick', userId, msg.author.id, reason)
    await msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`:boot: ${member.mention} has been kicked.`))
  }
}
