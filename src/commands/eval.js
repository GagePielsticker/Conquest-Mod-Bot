const { Command } = require('./')

module.exports = class Eval extends Command {
  constructor (client) {
    super(client, ['eval', 'ev'], 'Eval code on the bot', 3)
  }

  async clean (text) {
    if (typeof (text) === 'string') { return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203)) } else { return text }
  }

  async run (msg, args) {
    try {
      const code = args.join(' ')
      let evaled = await eval(code)
      if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled, false, 1) }
      const output = await this.clean(evaled)
      await msg.channel.send(new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setTitle('OUTPUT')
        .setDescription(`\`\`\`xl\n${output}\`\`\``)
      )
    } catch (err) {
      const output = await this.clean(err)
      await msg.channel.send(new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setTitle('ERROR')
        .setDescription(`\`\`\`xl\n${output}\`\`\``)
      )
    }
  }
}
