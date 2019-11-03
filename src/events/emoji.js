class Starboard {
  constructor (client) {
    this.client = client
    this.starLimit = 3
    this.starboardChannel = '633150338534342666'
    this.star = '⭐'
    this.couch = client.conquestCouchDatabase
  }

  async getStarCount (originUsers, starboardUsers) {
    const users = []
    originUsers.map(user => { if (user.id !== '632770883718610946') users.push(user.id) })
    starboardUsers.map(user => { if (user.id !== '632770883718610946') users.push(user.id) })
    const output = users.filter((data, index) => users.indexOf(data) === index)
    return output.length
  }

  async getStars (starsObj) {
    const stars = []
    const starIds = Object.keys(starsObj)
    starIds.map(id => stars.push(starsObj[id]))
    return stars
  }

  async starToDB (msg, starboardMsgID, stars) {
    const starboard = await this.couch.get('starboard')
    starboard.stars[msg.id] = {
      original: msg.id,
      starboardMsg: starboardMsgID,
      channelId: msg.channel.id,
      msgAuthorID: msg.author.id,
      stars: stars
    }
    await this.couch.insert(starboard, 'starboard')
  }

  async deleteStarFromDb (msgId) {
    const starboard = await this.couch.get('starboard')
    delete starboard.stars[msgId]
    await this.couch.insert(starboard, 'starboard')
  }

  async updateStarMessage (action, msg, stars, _starboardMessageID) {
    if (action === 'DELETE') {
      const message = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel).messages.fetch(_starboardMessageID)
      await message.delete()
      await this.deleteStarFromDb(msg.id)
      return true
    }
    if (action === 'EDIT') {
      const channel = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel)
      const message = await channel.messages.fetch(_starboardMessageID)
      return message.edit(`${this.star} **${stars}** | ${msg.channel}`, message.embeds[0])
    }
    if (action === 'POST') {
      const channel = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel)
      let content = ''
      const embed = new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setFooter('ID: ' + msg.id)
        .setTimestamp()
      if (msg.content !== '') {
        content += msg.content + '\n'
      }
      if (msg.attachments.size >= 1) {
        embed.setImage(msg.attachments.first().url)
      }
      if (msg.embeds.length > 0) {
        if (msg.embeds[0].thumbnail) {
          embed.setDescription(msg.content)
          embed.setImage(msg.embeds[0].thumbnail.url)
        }
        if (msg.embeds[0].fields.length > 0) {
          content += '>>> '
          msg.embeds[0].fields.map(f => { content += `**${f.name}**\n**${f.value}**\n` })
        } else embed.setDescription(content)
      }
      embed.setDescription(content)
      const _m = await channel.send(`${this.star} **${stars}** | ${msg.channel}`, embed)
      await _m.react(this.star)
      return _m
    }
  }

  async starUpdated (msg, user, reaction) {
    if (user.id === this.client.user.id) return
    const starboard = await this.couch.get('starboard')
    const stars = await this.getStars(starboard.stars)
    const star = stars.find(s => s.original === msg.id || s.starboardMsg === msg.id)
    if (!star) {
      if (user.id === msg.author.id) {
        const msgReact = await msg.reactions.resolve(this.star)
        if (msgReact) {
          return msgReact.users.remove(msg.author.id)
        }
      }
      if (msg.author.id === '632770883718610946') return
      if (!msg.channel.id !== this.starboardChannel) {
        if (msg.reactions.resolve(this.star)) {
          const userReactions = await msg.reactions.resolve(this.star).users.fetch()
          if (userReactions && userReactions.size >= this.starLimit) {
            const starboardMessage = await this.updateStarMessage('POST', msg, userReactions.size)
            await this.starToDB(msg, starboardMessage.id, userReactions.size)
          }
        }
      }
    } else {
      if (msg.reactions.resolve(this.star)) {
        const originMessage = await this.client.guilds.get('597553336044224522').channels.get(star.channelId).messages.fetch(star.original)
        const channel = await this.client.guilds.get('597553336044224522').channels.get(this.starboardChannel)
        const starboardMsg = await channel.messages.fetch(star.starboardMsg)
        if (!starboardMsg || !originMessage) {
          await this.updateStarMessage('DELETE', msg, 0, star.starboardMsg)
          await this.deleteStarFromDb(msg.id)
        }
        if (originMessage && starboardMsg) {
          if (user.id === originMessage.author.id) {
            const msgReact = await originMessage.reactions.resolve(this.star)
            const msgSbReact = await starboardMsg.reactions.resolve(this.star)
            if (msgSbReact) {
              msgSbReact.users.remove(user.id)
            }
            if (msgReact) {
              msgReact.users.remove(user.id)
            }
          }
        }
        const userReactions = await originMessage.reactions.resolve(this.star).users.fetch()
        const starboardReactions = await starboardMsg.reactions.resolve(this.star).users.fetch()
        const starCount = await this.getStarCount(userReactions, starboardReactions)
        if (userReactions && userReactions.size >= this.starLimit) {
          await this.updateStarMessage('EDIT', originMessage, starCount, starboardMsg.id)
          await this.starToDB(originMessage, starboardMsg.id, starCount)
        } else {
          await this.updateStarMessage('DELETE', msg, 0, star.starboardMsg)
          await this.deleteStarFromDb(msg.id)
        }
      } else {
        await this.updateStarMessage('DELETE', msg, 0, star.starboardMsg)
        await this.deleteStarFromDb(msg.id)
      }
    }
  }
}
exports.Starboard = Starboard
