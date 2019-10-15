const { Command } = require('.')

module.exports = class UserInfo extends Command {
  constructor (client) {
    super(client, ['userinfo', 'ui'], 'Get information about a user', 0)
  }

  async run (msg, args) {
    let id
    if (args.length === 0) id = msg.author.id
    else id = args[0].replace(/[<@!>]+/g, '')
    this.client.users.fetch(id).then(user => {
      const embed = new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setThumbnail(user.avatarURL())
        .addField('User Information:', `
**Username**: \`${user.username}\`
**Descriminator**: \`${user.discriminator}\`

**Account Created**: \`${user.createdAt.toUTCString()}\`
**Account Created (Time)**: 
${this.client.convertTime((Date.now() - user.createdAt))}
`)
      msg.channel.send({ embed })
    }).catch(async () => {
      await msg.channel.send(new this.client.discord.MessageEmbed()
        .addField('Error', 'User Not Found.')
        .setColor(this.client.embedColor))
    })
  }
}
