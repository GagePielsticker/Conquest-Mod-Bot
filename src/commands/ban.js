const { Command } = require('./')

module.exports = class Ban extends Command {
  constructor (client) {
    super(client, ['ban', 'b'], 'Ban a user.', 1)
  }

  async run (msg, args) {
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Give a user to kick.'))
    const userId = args[0].replace(/[<@!>]+/, '')
    const reason = args.splice(1).join(' ')
    const member = await msg.guild.members.get(userId)
    if (member) {
      if (this.client.permissionCheck(this.client, member) >= 1) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('You can not use me to kick your peers. :eyes:'))
    }
    const user = await this.client.users.fetch(userId)
    if (!user) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('User not found.'))
    await msg.guild.members.ban(userId, reason)
    await this.client.conquestModLogHandler.addCase('Ban', userId, msg.author.id, reason)
    await msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`:boot: \`${user.username}#${user.discriminator}\` has been banned.`))
  }
}
