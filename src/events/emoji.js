class Starboard {
  constructor (client) {
    this.client = client
    this.starLimit = 3
    this.starboardChannel = '633150338534342666'
    this.blacklistChannel = '633942679331405834'
    this.couch = client.conquestCouchDatabase
  }

  async starToDB (msg, starboardMsgID, stars) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    starboardDB.stars[msg.id] = {
      original: msg.id,
      starboardMsg: starboardMsgID,
      channelId: msg.channel.id,
      msgAuthorID: msg.author.id,
      stars: stars
    }
    this.couch.insert(starboardDB, 'starboard')
  }

  async deleteStar (msgId) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = starboardDB.stars[msgId]
    await this.client.guilds.get('597553336044224522')
      .channels.get(star.channelId).messages.get(star.starboardMsg).delete()
    delete starboardDB.stars[msgId]
    await this.couch.insert(starboardDB, 'starboard')
  }

  async editStar (msgId) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = starboardDB.stars[msgId]
    const original = await this.client.guilds.get('597553336044224522')
      .channels.get(star.channelId).messages.get(star.original)
    const starboardMessage = await this.client.guilds.get('597553336044224522')
      .channels.get(this.starboardChannel).messages.get(star.starboardMsg)
    await starboardMessage.edit({
      content: `⭐ ${original.reactions.get('⭐').count} | <#${star.channelId}>`
    })
    await this.starToDB(original.id, starboardMessage.id, original.reactions.get('⭐').count)
  }

  async starAdded (msg, user, reaction) {
    if (user !== msg.member.user) {
      if (msg.reactions.get('⭐').count === this.starLimit) {
        const content = msg.content ? msg.content : 'No Text Content'
        const embed = new this.client.discord.MessageEmbed()
          .setTitle('Message Starred!')
          .setAuthor(msg.author.tag, msg.author.avatarURL(), 'https://conquestsim.io')
          .addField('Content:', content)
          .addField('Message Jump:', `[Click me!](${msg.url})`)
          .setFooter('⭐ Starboard ⭐| By Luke#6723')
        const startboardMessage = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel)
          .send(`⭐ ${msg.reactions.get('⭐').count} | <#${msg.channel.id}>`, embed)
        await this.starToDB(msg, startboardMessage.id, msg.reactions.get('⭐').count)
      } else if (msg.reactions.get('⭐').count > this.starLimit) {
        this.editStar(msg.id)
      }
    } else {
      await msg.reactions.get('⭐').users.remove(user.id)
    }
  }

  async starRemoved (msg, user) {
    if (user !== msg.member.user) {
      if (!msg.reactions.get('⭐') === undefined && msg.reactions.get('⭐').count >= this.starLimit) {
        this.editStar(msg.id)
      } else if (msg.reactions.get('⭐') === undefined || msg.reactions.get('⭐').count < this.starLimit) {
        this.deleteStar(msg.id)
      }
    } else {
      if (msg.reactions.get('⭐') !== undefined) {
        await msg.reactions.get('⭐').users.remove(user.id)
      }
    }
  }

  async starBlacklisted (msg, user, reaction) {
    const content = msg.content ? msg.content : 'No Text Content'
    const embed = new this.client.discord.MessageEmbed()
      .setTitle('Message Blacklisted from Starboard!')
      .setAuthor(msg.author.tag, msg.author.avatarURL(), 'https://conquestsim.io')
      .addField('Content:', content)
      .addField('Message Jump:', `[Click me!](${msg.url})`)
      .setFooter('⭐ Starboard ⭐| By Luke#6723')
    this.client.guilds.get('597553336044224522').channels.get(this.blacklistChannel).send({ embed })
  }
}
exports.Starboard = Starboard
