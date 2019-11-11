const { Command } = require('./')

module.exports = class CaseSearch extends Command {
  constructor (client) {
    super(client, ['casesearch', 'cs'], 'Mod log case search', 1)
  }

  async run (msg, args) {
    const caseNum = args[0] || null
    const modlog = await this.client.conquestCouchDatabase.get('modlog')
    const cases = []
    await Object.keys(modlog.cases).map(_case => cases.push(modlog.cases[_case]))
    const search = await cases.find(m => m.case === Number.parseInt(caseNum))
    if (!search) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('No case'))
    const modlogMsg = await msg.guild.channels.get(process.env.MODLOG_CHANNEL_ID).messages.fetch(search.messageID)
    await msg.channel.send('**Case Found:**', modlogMsg.embeds[0])
  }
}
