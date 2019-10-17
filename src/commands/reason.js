const { Command } = require('./')

module.exports = class Reason extends Command {
  constructor (client) {
    super(client, ['r', 'reason'], 'Set a modlog reason.', 1)
  }

  async run (msg, args) {
    const messageSplit = args.join(' ').split('|')
    const caseNumber = args[0]
    const newReason = args.splice(1).join(' ')
    let muteTimer = -1
    if (messageSplit.length === 2) {
      if (messageSplit[1] === '') return
      muteTimer = await this.client.checkTime(messageSplit[1].trim())
    }
    await msg.delete()
    const result = await this.client.conquestModLogHandler.editCase(caseNumber, msg.author.id, newReason, muteTimer)
    if (!result) { await msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('That case does not exist.')) }
  }
}
