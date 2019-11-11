module.exports = async (client, member) => {
  const logChannel = member.guild.channels.get(process.env.LOGS_CHANNEL_ID)
  const userAge = client.convertTime((Date.now() - member.user.createdAt))
  member.roles.add(['632493565376724992', '633797656501682233']).catch()
  const mutes = await client.conquestCouchDatabase.get('mutes')
  if (mutes.mutes[member.id]) {
    member.roles.add('632686943758712862').catch()
  }
  logChannel.send(
    new client.discord.MessageEmbed()
      .setDescription(`${member.user.tag} | <@${member.id}> | (${member.id})`)
      .setAuthor('User Joined', member.user.avatarURL(), 'https://conquestsim.io/')
      .addField('Account Age:', userAge)
      .setColor(client.embedColor)
  )
}
