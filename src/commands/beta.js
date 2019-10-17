const { Command } = require('./')

module.exports = class Beta extends Command {
  constructor (client) {
    super(client, 'beta', 'Give a user beta access.', 3)
  }

  async run (msg, args) {
    const text = args.join(' ').replace(/[\n]+/g, ' ').replace(/[<@!>]+/g, '').split(' ')
    const webhook = await this.client.fetchWebhook('634193260650168320', 'EboEl9FD3woy_AuFC9Ec4dUGvL6RFtr9d4FE5-fksy0F-hLhOjOPwf4s-AKnOmO0gkI8')
    text.map(async (u) => {
      const userObj = await msg.guild.members.fetch(u)
      if (userObj) {
        await userObj.roles.add('633828234911285258')
        // https://canary.discordapp.com/api/webhooks/634193260650168320/EboEl9FD3woy_AuFC9Ec4dUGvL6RFtr9d4FE5-fksy0F-hLhOjOPwf4s-AKnOmO0gkI8
        await webhook.send(`:tada: <@${userObj.id}> Welcome to Conquest Beta testing. Please read <#633921685963276319>`)
        await msg.guild.channels.get('633150754470756352').send(new this.client.discord.MessageEmbed().setColor(this.client.embedColor).setAuthor('Conquest Beta', msg.guild.iconURL(), 'https://conquestsim.io/').setDescription(`<@${userObj.id}> has been given Beta Access :tada:`).setFooter(`id: ${userObj.id} | Added by: ${msg.author.tag}`).setTimestamp())
      }
    })
  }
}
