// require commands for init
const commands = require('../commands')

module.exports = (client) => {
  client.user.setActivity('Conquest', { type: 'WATCHING' })
  console.log('[Conquest] Initialising Commands!')
  commands.init().then(() => {
    console.log('[Conquest] Ready!')
  }).catch(console.log)
}
