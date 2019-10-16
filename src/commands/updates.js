const { Command } = require('./')

module.exports = class Ping extends Command {
  constructor (client) {
    super(client, 'updates', 'Toggle updates role for Conquest.', 0)
  }

  async run (msg, args) {
    const member = msg.member
    if (member.roles.has('633797656501682233')) {
      await member.roles.remove('633797656501682233')
      msg.channel.send('You will now recieve updates for Conquest').then(message => {
        msg.delete({ timeout: 1000 })
        message.delete({ timeout: 1000 })
      })
    } else {
      await member.roles.add('633797656501682233')
      msg.channel.send('You will now recieve updates for Conquest').then(message => {
        msg.delete({ timeout: 1000 })
        message.delete({ timeout: 1000 })
      })
    }
  }
}
