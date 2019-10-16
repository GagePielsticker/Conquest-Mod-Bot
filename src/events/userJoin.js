module.exports = (client, member) => {
  const logChannel = member.guild.channels.get('633150754470756352')
  const userAge = client.convertTime((Date.now() - member.user.createdAt))
  member.roles.add(['632493565376724992', '633797656501682233']).catch()
  logChannel.send(
    new client.discord.MessageEmbed()
      .setDescription(`${member.user.tag} | <@${member.id}> | (${member.id})`)
      .setAuthor('User Joined', member.user.avatarURL(), 'https://conquestsim.io/')
      .addField('Account Age:', userAge)
      .setColor(client.embedColor)
  )
}
