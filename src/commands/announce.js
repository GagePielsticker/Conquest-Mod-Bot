const { Command } = require('./')

module.exports = class Announce extends Command {
  constructor (client) {
    super(client, ['announce', 'annoucement'], 'Make an announcement.', 3)
  }

  async run (msg, args) {
    const content = args.join(' ')
    const title = 'New Update for Conquest'
    const pingId = '633797656501682233'
    const channel = '597553655704453121'
    const role = msg.guild.roles.get(pingId)
    role.setMentionable(true, `Announcement by ${msg.author.tag}`).then(() => {
      const embed = new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setAuthor(title, msg.guild.iconURL(), 'https://conquestsim.io')
        .setDescription(content)
        .setFooter(`Announcement by: ${msg.author.tag} | https://conquestsim.io`, msg.author.avatarURL())
      msg.guild.channels.get(channel).send(`<@&${pingId}>`, embed).then(() => {
        role.setMentionable(false, `Announcement by ${msg.author.tag}`)
      })
    }).then(() => {
      msg.delete()
    })
  }
}
