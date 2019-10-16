// require commands for init
const commands = require('../commands')

module.exports = (client) => {
  console.log('[Conquest] Initialising Commands!')
  commands.init(client).then(() => {
    client.guilds.get('597553336044224522').channels.map(channel => {
      if (channel.type === 'text') return channel.messages.fetch()
    })
    console.log('[Conquest] Ready!')
  }).catch(console.log)
}
