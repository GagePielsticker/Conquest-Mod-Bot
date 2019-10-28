module.exports = async (client, msg) => {
  if (msg.author.bot) return
  if (msg.guild.id !== '597553336044224522') return
  const userPerms = client.permissionCheck(client, msg.member)
  const prefix = 'cm!'
  const splitMessage = msg.content.replace(/[ ]+/, ' ').split(' ')
  let givenPrefix = splitMessage[0].substring(0, 3).toLowerCase()
  let givenCommand = splitMessage[0].substring(3).toLowerCase()
  const args = splitMessage.splice(1)
  if (givenPrefix === prefix) {
    const command = client.commands.get(givenCommand)
    if (command) {
      if (userPerms >= command.permission) {
        return command.run(msg, args)
      }
    }
  }
  givenPrefix = splitMessage[0].substring(0, 1).toLowerCase()
  givenCommand = splitMessage[0].substring(1).toLowerCase()
  const tagPrefix = '-'
  if (givenPrefix === tagPrefix) {
    const tags = await client.conquestCouchDatabase.get('tags')
    const tag = tags[givenCommand]
    if (tag) {
      const embed = new client.discord.MessageEmbed()
        .setDescription(tag.content)
      if (tag.image) embed.setImage(tag.image)
      if (tag.color) embed.setColor(tag.color)
      else embed.setColor(client.embedColor)
      if (userPerms >= 1) {
        return msg.channel.send(embed)
      }
    }
  }
}
