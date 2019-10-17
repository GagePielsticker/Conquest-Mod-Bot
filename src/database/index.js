exports.Modlog = class Modlog {
  constructor (client) {
    this.client = client
    this.modlogChannel = '633150706668273674'
  }

  async addMute (userID, caseNum, modlogMessageID, unmuteTime) {
    const muteDB = await this.client.conquestCouchDatabase.get('mutes')
    muteDB.mutes[userID] = {
      case: caseNum,
      modlogMessageID: modlogMessageID,
      unmuteTime: unmuteTime
    }
    await this.client.conquestCouchDatabase.insert(muteDB, 'mutes')
  }

  async removeMute (userID) {
    const muteDB = await this.client.conquestCouchDatabase.get('mutes')
    const caseNum = muteDB.mutes[userID].case
    const modlog = await this.client.conquestCouchDatabase.get('modlog')
    const modlogCase = modlog.cases[caseNum]
    const moderatorUserObj = await this.client.users.fetch(modlogCase.moderatorID)
    const punishedUserObj = await this.client.users.fetch(modlogCase.userID)
    const userOrBot = punishedUserObj.bot ? 'Bot' : 'User'
    const embed = new this.client.discord.MessageEmbed()
      .setColor(this.client.embedColor)
      .setTitle(`${modlogCase.action} | Case #${modlogCase.case}`)
      .addField(`${userOrBot}`, `${punishedUserObj.tag} (<@${punishedUserObj.id}>)`, true)
      .addField('Moderator', moderatorUserObj.tag, true)
      .addField('Reason', modlogCase.reason, false)
      .setFooter('User has since been unmuted.')
      .setTimestamp(modlogCase.timeOfCase)
    const message = await this.client.channels.get(this.modlogChannel).messages.fetch(modlogCase.messageID)
    await message.edit({ embed })
    delete muteDB.mutes[userID]
    await this.client.conquestCouchDatabase.insert(muteDB, 'mutes')
  }

  async addCase (action, userID, moderatorID, reason, unmuteTime = 'perm') {
    const modlog = await this.client.conquestCouchDatabase.get('modlog')
    const newCaseNum = modlog.currentCase + 1
    const moderatorUserObj = await this.client.users.fetch(moderatorID)
    const punishedUserObj = await this.client.users.fetch(userID)
    const userOrBot = punishedUserObj.bot ? 'Bot' : 'User'
    reason = reason || `\`Moderator please do cm!reason ${newCaseNum} <reason>\``
    const embed = new this.client.discord.MessageEmbed()
      .setColor(this.client.embedColor)
      .setTitle(`${action} | Case #${newCaseNum}`)
      .addField(`${userOrBot}`, `${punishedUserObj.tag} (<@${punishedUserObj.id}>)`, true)
      .addField('Moderator', moderatorUserObj.tag, true)
      .addField('Reason', reason, false)
      .setTimestamp()
    if (action === 'Mute') {
      const theMath = (Date.now() + (unmuteTime * 1000))
      const unmuteTimeDate = new Date(theMath)
      embed.setFooter(`Unmute at: ${unmuteTimeDate.toUTCString().substr(0, 22)} UTC`)
    }
    const modlogMessage = await this.client.channels.get(this.modlogChannel).send(embed)
    modlog.currentCase = newCaseNum
    modlog.cases[newCaseNum] = {
      case: newCaseNum,
      messageID: modlogMessage.id,
      action: action,
      userID: userID,
      moderatorID: moderatorID,
      reason: reason,
      timeOfCase: Date.now()
    }
    if (action === 'Mute') {
      const theMath = (Date.now() + (unmuteTime * 1000))
      const timeOfUnmute = new Date(theMath).getTime()
      await this.addMute(userID, newCaseNum, modlogMessage.id, timeOfUnmute)
    }
    await this.client.conquestCouchDatabase.insert(modlog, 'modlog')
  }

  async editCase (caseNumber, moderatorID, newReason, newUnmuteTime) {
    const modlog = await this.client.conquestCouchDatabase.get('modlog')
    const modlogCase = modlog.cases[caseNumber]
    if (!modlogCase) return false
    const moderatorUserObj = await this.client.users.fetch(moderatorID)
    const punishedUserObj = await this.client.users.fetch(modlogCase.userID)
    const userOrBot = punishedUserObj.bot ? 'Bot' : 'User'
    const embed = new this.client.discord.MessageEmbed()
      .setColor(this.client.embedColor)
      .setTitle(`${modlogCase.action} | Case #${modlogCase.case}`)
      .addField(`${userOrBot}`, `${punishedUserObj.tag} (<@${punishedUserObj.id}>)`, true)
      .addField('Moderator', moderatorUserObj.tag, true)
      .addField('Reason', newReason, false)
      .setTimestamp(modlogCase.timeOfCase)
    if (modlogCase.action === 'Mute' && newUnmuteTime !== 'perm') {
      const theMath = (Date.now() + (newUnmuteTime * 1000))
      const unmuteTimeDate = new Date(theMath)
      embed.setFooter(`Unmute at: ${unmuteTimeDate.toUTCString().substr(0, 22)} UTC`)
      const timeOfUnmute = new Date(theMath).getTime()
      this.addMute(modlogCase.userID, caseNumber, modlogCase.messageID, timeOfUnmute)
    }
    const message = await this.client.channels.get(this.modlogChannel).messages.fetch(modlogCase.messageID)
    await message.edit({ embed })
    modlogCase.reason = newReason
    modlogCase.moderatorID = moderatorID
    modlog.cases[caseNumber] = modlogCase
    await this.client.conquestCouchDatabase.insert(modlog, 'modlog')
    return true
  }
}
