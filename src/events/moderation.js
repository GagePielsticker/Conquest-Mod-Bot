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
    await guild.channels.get('633150754470756352').send(new client.discord.MessageEmbed()
      .setDescription(`${user.user.tag} | <@${user.id}> | (${user.id})`)
      .setAuthor('User Left', user.user.avatarURL(), 'https://conquestsim.io/')
      .addField('Account Age:', userAge)
      .setColor(client.embedColor))
  }
}
