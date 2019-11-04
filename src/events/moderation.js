async function checkAudit (client, user, guild, action) {
  const auditLogs = await guild.fetchAuditLogs()
  const firstEntry = auditLogs.entries.first()
  if (firstEntry.action === action) {
    if (user.id === firstEntry.target.id) {
      return firstEntry
    } else return undefined
  } else return undefined
}

// e.entries.first().createdTimestamp
exports.userBanned = async (client, user, guild, time) => {
  const firstEntry = await checkAudit(client, user, guild, 'MEMBER_BAN')
  const theMath = Math.floor(((firstEntry.createdTimestamp - time) / 1000) % 60)
  if (theMath <= 0) { await client.conquestModLogHandler.addCase('Ban', user.id, firstEntry.executor.id, firstEntry.reason) }
}

exports.userLeaveorKicked = async (client, user, guild, time) => {
  const firstEntry = await checkAudit(client, user, guild, 'MEMBER_KICK')

  if (firstEntry) {
    const theMath = Math.floor(((firstEntry.createdTimestamp - time) / 1000) % 60)
    if (theMath <= 0) { await client.conquestModLogHandler.addCase('Kick', user.id, firstEntry.executor.id, firstEntry.reason) }
  } else {
    const userAge = client.convertTime((Date.now() - user.user.createdAt))
    await guild.channels.get('640690486671310888').send(new client.discord.MessageEmbed()
      .setDescription(`${user.user.tag} | <@${user.id}> | (${user.id})`)
      .setAuthor('User Left', user.user.avatarURL(), 'https://conquestsim.io/')
      .addField('Account Age:', userAge)
      .setColor(client.embedColor))
  }
}

exports.messageDelete = async (client, msg) => {
  if (msg.author.bot) return
  if (msg.channel === '635674366381785117') return
  const embed = new client.discord.MessageEmbed().setColor(client.embedColor).setTitle('Message Deleted').setAuthor(msg.author.tag, msg.author.avatarURL())
  const logChannel = msg.guild.channels.get('640690486671310888')
  embed.setDescription(`Channel: ${msg.channel}`)
  embed.addField('Content:', `${msg.content === '' ? 'None' : msg.content}`)
  if (msg.attachments.size > 0) {
    embed.setImage(msg.attachments.first().proxyURL)
  }
  logChannel.send(embed)
}

exports.messageEdit = (client, oldMsg, newMsg) => {
  if (newMsg.author.bot) return
  if (oldMsg.channel === '635674366381785117') return
  if (oldMsg.content === newMsg.content) return
  const embed = new client.discord.MessageEmbed().setColor(client.embedColor).setTitle('Message Edited').setAuthor(newMsg.author.tag, newMsg.author.avatarURL())
  const logChannel = newMsg.guild.channels.get('640690486671310888')
  embed.setDescription(`Channel: ${oldMsg.channel}`)
  embed.addField('[Before] Content:', `${oldMsg.content === '' ? 'None' : oldMsg.content}`)
  embed.addField('[After] Content:', `${newMsg.content === '' ? 'None' : newMsg.content}`)
  logChannel.send(embed)
}
