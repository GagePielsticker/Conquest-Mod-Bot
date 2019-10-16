class Starboard {
  constructor (client) {
    this.client = client
    this.starLimit = 3
    this.starboardChannel = '633150338534342666'
    this.blacklistChannel = '633942679331405834'
    this.couch = client.conquestCouchDatabase
  }

  async getStarCount (originUsers, starboardUsers) {
    const users = []
    originUsers.map(user => { if (user.id !== '632770883718610946') users.push(user.id) })
    starboardUsers.map(user => { if (user.id !== '632770883718610946') users.push(user.id) })
    const output = users.filter((data, index) => users.indexOf(data) === index)
    return output.length
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
      .channels.get(star.channelId).messages.fetch(star.original, true)
    const starboardMessage = await this.client.guilds.get('597553336044224522')
      .channels.get(this.starboardChannel).messages.fetch(star.starboardMsg, true)
    const starboardReactions = await starboardMessage.reactions.resolve('⭐').users.fetch()
    const originalReactions = await original.reactions.resolve('⭐').users.fetch()
    const currentCount = await this.getStarCount(originalReactions, starboardReactions)
    await starboardMessage.edit({
      content: `⭐ ${currentCount} | <#${star.channelId}>`
    })
    await this.starToDB(original, starboardMessage.id, currentCount)
  }

  async starAdded (msg, user, reaction) {
    const starboardDB = await this.client.conquestCouchDatabase.get('starboard')
    const star = starboardDB.stars.find(star => star.original === msg.id || star.starboardMsg === msg.id)
    if (star) {
      return this.editStar(star.original, user)
    }
    if (user !== msg.member.user) {
      const reactions = await msg.reactions.resolve('⭐').users.fetch()
      if (reactions.size === this.starLimit) {
        const content = msg.content ? msg.content : 'No Text Content'
        const embed = new this.client.discord.MessageEmbed()
          .setColor(this.client.embedColor)
          .setTitle('Message Starred!')
          .setAuthor(msg.author.tag, msg.author.avatarURL(), 'https://conquestsim.io')

        if (msg.content.length !== 0) {
          embed.addField('Content:', content)
        }
        embed.addField('Message Jump:', `[Click me!](${msg.url})`)
        embed.setFooter('⭐ Starboard ⭐| By Luke#6723')
        if (msg.embeds.length > 0) {
          if (msg.embeds[0].embeds) {
            if (embed.setImage(msg.embeds[0].thumbnail)) {
              embed.setImage(msg.embeds[0].thumbnail.url)
            }
          }
        }
        if (msg.attachments) {
          embed.setImage(msg.attachments.first().url)
        }
        const starboardMessage = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel).send(`⭐ ${msg.reactions.get('⭐').count} | <#${msg.channel.id}>`, embed)
        await starboardMessage.react('⭐')
        if (msg.channel.id !== this.starboardChannel) {
          await this.starToDB(msg, starboardMessage.id, msg.reactions.get('⭐').count)
        }
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
      if (star) {
        const original = await this.client.guilds.get('597553336044224522')
          .channels.get(star.channelId).messages.fetch(star.original, true)
        const starboardMessage = await this.client.guilds.get('597553336044224522')
          .channels.get(this.starboardChannel).messages.fetch(star.starboardMsg, true)
        const starboardReactions = await starboardMessage.reactions.resolve('⭐').users.fetch()
        const originalReactions = await original.reactions.resolve('⭐').users.fetch()
        const currentCount = await this.getStarCount(originalReactions, starboardReactions)
        if (currentCount < this.starLimit) {
          return this.deleteStar(original.id, user)
        } else {
          return this.editStar(star.original, user)
        }
      } else {
        const reactions = await msg.reactions.resolve('⭐')
        if (reactions) {
          const users = await reactions.users.fetch()
          if (users.size >= this.starLimit) {
            this.editStar(msg.id, user)
          } else if (users.size < this.starLimit) {
            this.deleteStar(msg.id, user)
          }
        }
      }
    }
  }
}
exports.Starboard = Starboard
