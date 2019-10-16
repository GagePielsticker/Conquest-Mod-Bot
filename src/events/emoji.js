class Starboard {
  constructor (client) {
    this.client = client
    this.starLimit = 1
    this.starboardChannel = '633150338534342666'
    this.blacklistChannel = '633942679331405834'
    this.couch = client.conquestCouchDatabase
  }

  async starToDB (msg, starboardMsgID, stars) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = starboardDB.stars.find(star => star.original === msg.id)
    await starboardDB.stars.splice(starboardDB.stars.indexOf(star))
    starboardDB.stars.push({
      original: msg.id,
      starboardMsg: starboardMsgID,
      channelId: msg.channel.id,
      msgAuthorID: msg.author.id,
      stars: stars
    })
    this.couch.insert(starboardDB, 'starboard')
  }

  async deleteStar (msgId) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = await starboardDB.stars.find(star => star.original === msgId)
    if (!star) return
    await this.client.guilds.get('597553336044224522')
      .channels.get(this.starboardChannel).messages.get(star.starboardMsg).delete()
    await starboardDB.stars.splice(starboardDB.stars.indexOf(star))
    await this.couch.insert(starboardDB, 'starboard')
  }

  async editStar (msgId, user) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = starboardDB.stars.find(star => star.original === msgId || star.starboardMsg === msgId)
    const original = await this.client.guilds.get('597553336044224522')
      .channels.get(star.channelId).messages.fetch(star.original)
    if (original.author.id === user.id) return
    const starboardMessage = await this.client.guilds.get('597553336044224522')
      .channels.get(this.starboardChannel).messages.fetch(star.starboardMsg)

    var currentUsers = []
    starboardMessage.reactions.get('⭐').users.map(u => currentUsers.push(u.id))
    original.reactions.get('⭐').users.map(u => currentUsers.push(u.id))
    const currentCount = currentUsers.filter((user, index) => currentUsers.indexOf(user) === index && user !== this.client.user.id).length
    await starboardMessage.edit({
      content: `⭐ ${currentCount} | <#${star.channelId}>`
    })
    await this.starToDB(original, starboardMessage.id, currentCount)
  }

  async starAdded (msg, user, reaction) {
    if (user !== msg.member.user) {
      if (msg.reactions.get('⭐').count === this.starLimit) {
        const content = msg.content ? msg.content : 'No Text Content'
        const embed = new this.client.discord.MessageEmbed()
          .setColor(this.client.embedColor)
          .setTitle('Message Starred!')
          .setAuthor(msg.author.tag, msg.author.avatarURL(), 'https://conquestsim.io')
          .addField('Content:', content)
          .addField('Message Jump:', `[Click me!](${msg.url})`)
          .setFooter('⭐ Starboard ⭐| By Luke#6723')
        if (msg.embeds) {
          embed.setImage(msg.embeds[0].thumbnail.url)
        }
        const starboardMessage = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel).send(`⭐ ${msg.reactions.get('⭐').count} | <#${msg.channel.id}>`, embed)
        const sbm = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel).messages.fetch(starboardMessage.id)
        await sbm.react('⭐')
        await this.starToDB(msg, starboardMessage.id, msg.reactions.get('⭐').count)
      } else if (msg.reactions.get('⭐').count > this.starLimit) {
        this.editStar(msg.id, user)
      }
    } else if (user === msg.member.user && !user.bot) {
      await msg.reactions.get('⭐').users.remove(user.id)
    }
  }

  async starRemoved (msg, user) {
    if (user !== msg.member.user && !user.bot) {
      const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
      const star = starboardDB.stars.find(star => star.original === msg.id || star.starboardMsg === msg.id)
      const original = await this.client.guilds.get('597553336044224522')
        .channels.get(star.channelId).messages.fetch(star.original)
      if (original.author.id === user.id) return
      const starboardMessage = await this.client.guilds.get('597553336044224522')
        .channels.get(this.starboardChannel).messages.fetch(star.starboardMsg)

      var currentUsers = []
      if (original.reactions.get('⭐') === undefined) {
        return this.deleteStar(msg.id, user)
      }
      starboardMessage.reactions.get('⭐').users.map(u => currentUsers.push(u.id))
      original.reactions.get('⭐').users.map(u => currentUsers.push(u.id))
      const currentCount = currentUsers.filter((user, index) => currentUsers.indexOf(user) === index && user !== this.client.user.id).length
      if (currentCount >= this.starLimit) {
        this.editStar(msg.id, user)
      } else if (msg.reactions.get('⭐') === undefined || msg.reactions.get('⭐').count < this.starLimit) {
        this.deleteStar(msg.id, user)
      }
    } else {
      if (msg.reactions.get('⭐') !== undefined) {
        await msg.reactions.get('⭐').users.remove(user.id)
      }
    }
  }
}
exports.Starboard = Starboard
