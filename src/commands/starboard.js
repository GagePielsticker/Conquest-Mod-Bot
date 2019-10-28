const { Command } = require('./')

module.exports = class StarboardLeaderboard extends Command {
  constructor (client) {
    super(client, ['topstar', 'tpostarboard', 'topstars'], 'List the top 10 stars.', 1)
  }

  async run (msg, args) {
    const starboard = await this.client.conquestCouchDatabase.get('starboard')
    const _stars = Object.keys(starboard.stars).map(s => starboard.stars[s])
    const stars = _stars.sort((a, b) => b.stars - a.stars)
    const embed = new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setTitle('Top 10 Stars')
    let output = ''
    for (let i = 0; i < 10; i++) {
      const s = stars[i]
      const author = await this.client.users.fetch(s.msgAuthorID)
      output += `⭐${i + 1}. **${author.tag}** [${s.stars} Stars]: [Jump](https://discordapp.com/channels/597553336044224522/633150338534342666/${s.starboardMsg})\n`
    }
    embed.setDescription(output)
    await msg.channel.send(embed)
  }
}
