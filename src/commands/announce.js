const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, ['announce', 'annoucement'], 'Make an announcement.', 3)
  }

  async run (msg, args) {
    const role = msg.guild.roles.get('633797656501682233')
    role.setMentionable(true, `Announcement by ${msg.author.tag}`).then(() => {
      const embed = new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setAuthor('New Update for Conquest', msg.guild.iconURL(), 'https://conquestsim.io')
        .setDescription(args.join(' '))
        .setFooter(`Announcement by: ${msg.author.tag} | https://conquestsim.io`, msg.author.avatarURL())
      msg.guild.channels.get('597553655704453121').send('<@&633797656501682233>', embed).then(() => {
        role.setMentionable(false, `Announcement by ${msg.author.tag}`)
      })
    }).then(() => {
      msg.delete()
    })
  }
}
