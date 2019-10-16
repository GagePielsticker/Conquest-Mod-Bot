const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, ['unban', 'ub'], 'Unban a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to unban.'))
    const userId = args[0].replace(/[<@!>]+/, '')
    const reason = args.splice(1).join(' ')
    const user = await this.client.users.fetch(userId)
    if (!user) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    const bans = await msg.guild.fetchBans()
    const ban = bans.get(userId)
    if (!ban) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not banned.'))
    await msg.guild.members.unban(userId, reason)
    await this.client.conquestModLogHandler.addCase('Unban', userId, msg.author.id, reason)
    await msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`:door: \`${user.username}#${user.discriminator}\` has been unbanned.`))
  }
}
