const { Command } = require('./')

module.exports = new Command('userinfo', ['ui'], 'Get user information', (client, msg, args) => {
  let id
  if (args.length === 0) id = msg.author.id
  else id = args[0].replace(/[<@!>]+/g, '')
  console.log(id)
  client.users.fetch(id).then(user => {
    const embed = new client.discord.MessageEmbed()
      .setColor(client.embedColor)
      .setThumbnail(user.avatarURL())
      .addField('User Information:', `
**Username**: \`${user.username}\`
**Descriminator**: \`${user.discriminator}\`

**Account Created**: \`${user.createdAt.toUTCString()}\`
**Account Created (Time)**: 
${client.convertTime((Date.now() - user.createdAt))}
`)
    msg.channel.send({ embed })
  }).catch(() => {
    msg.channel.send(new client.discord.MessageEmbed()
      .addField('Error', 'User Not Found.')
      .setColor(client.embedColor))
  })
}, 0)
