const { Command } = require('./')

module.exports = class Test extends Command {
  constructor (client) {
    super(client, 'test', 'Test command code', 3)
    this.modlog = new this.client.conquestModerationHandlers.Modlog(client)
  }

  async run (msg, args) {
    await this.modlog.addCase('action', 'userID', 'moderatorID', 'reason')
    await msg.channel.send('Test complete. Check console for output.')
  }
}
