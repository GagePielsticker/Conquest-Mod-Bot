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
      const content = args.join(' ')
      const silent = content.search(/^(-s)/i)
      const code = content.replace(/^(-s)/i, '').trim()
      let evaled = await eval(code)
      if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled, false, 0) }
      const output = await this.clean(evaled)
      if (silent) {
        await msg.channel.send(new this.client.discord.MessageEmbed()
          .setColor(this.client.embedColor)
          .setTitle('OUTPUT')
          .setDescription(`\`\`\`js\n${output}\`\`\``)
        )
      }
    } catch (err) {
      const output = await this.clean(err)
      await msg.channel.send(new this.client.discord.MessageEmbed()
        .setColor(this.client.embedColor)
        .setTitle('ERROR')
        .setDescription(`\`\`\`js\n${output}\`\`\``)
      )
    }
  }
}
