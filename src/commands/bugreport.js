const { Command } = require('.')

module.exports = class BugReport extends Command {
  constructor (client) {
    super(client, ['bug', 'bugreport', 'br'], 'Mod log case search', 0)
  }

  async run (msg, args) {
    const allArgs = args.join(' ')
    if (allArgs.split('|').length < 3) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Please give a bug using the correct syntax!'))
    const bug = allArgs.split('|')[0] === '' ? 'No explanation given.' : allArgs.split('|')[0]
    const origin = allArgs.split('|')[1] === '' ? 'No explanation given.' : allArgs.split('|')[1]
    const cause = allArgs.split('|')[2] === '' ? 'No explanation given.' : allArgs.split('|')[2]
    if (!msg.member.roles.has('633828234911285258')) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('You are not a beta tester!'))
    msg.guild.channels.get('633826774169550849').send(new this.client.discord.MessageEmbed()
      .setColor(this.client.embedColor)
      .addField('Bug:', bug)
      .addField('What should happen:', origin)
      .addField('What actually happens:', cause))
      .setFooter(`${msg.author.tag}`, msg.author.avatarURL())
      .setTimestamp()
  }
}
