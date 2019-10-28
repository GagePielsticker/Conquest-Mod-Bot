const { Command } = require('./')

module.exports = class Tags extends Command {
  constructor (client) {
    super(client, ['tag', 'tags'], 'create and/or remove a tag', 1)
  }

  async run (msg, args) {
    const tags = await this.client.conquestCouchDatabase.get('tags')
    if (args.length === 0) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Please use one of the following: `create, update, remove`'))
    if (args[0] === 'create') {
      if (tags[args[1]]) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`Tag \`${args[1]}\` already exists. Use \`update\` instead`))
      if (args.length <= 2) new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Please use the following syntax: cm!tags save [tag name] [text content]')
      if (args[2].toLowerCase() === 'none') tags[args[1]] = { content: '' }
      else tags[args[1]] = { content: args.splice(2).join(' ') }
      if (msg.attachments.size >= 1) tags[args[1]].image = msg.attachments.first().attachment
      await this.client.conquestCouchDatabase.insert(tags, 'tags')
      return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`Tag \`${args[1]}\` has been created successfully`))
    }
    if (args[0] === 'update') {
      if (args.length === 2) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Please use one of the following: `content, image, color`'))
      if (args[2] === 'content') {
        if (args[3].toLowerCase() === 'none') tags[args[1]].content = ''
        else tags[args[1]].content = args.splice(3).join(' ')
      }
      if (args[2] === 'image') {
        if (msg.attachments.size >= 1) tags[args[1]].image = msg.attachments.first().attachment
        else tags[args[1]].image = args.splice(3).join(' ')
      }
      if (args[2] === 'color') {
        const color = this.client.discord.Util.resolveColor(args.splice(3).join(' '))
        if (isNaN(color)) return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription('Please give a resolvable color. EG: #FFFFFF, [255, 0, 255], 11880263'))
        tags[args[1]].color = color
      }
      await this.client.conquestCouchDatabase.insert(tags, 'tags')
      return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`Tag \`${args[1]}\` has been created updated`))
    }
    if (args[0] === 'remove') {
      if (tags[args[1]]) {
        delete tags[args[1]]
        await this.client.conquestCouchDatabase.insert(tags, 'tags')
        return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setDescription(`Tag \`${args[1]}\` has been removed.`))
      }
    }
    if (args[0] === 'list') {
      delete tags._rev
      delete tags._id
      return msg.channel.send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setTitle('Current Tags:').setDescription(`\`\`\`${Object.keys(tags).join(', ')}\`\`\``))
    }
  }
}
