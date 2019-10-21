const { Command } = require('./')

module.exports = class StarboardLeaderboard extends Command {
  constructor (client) {
    super(client, ['sbl', 'sb', 'topstars'], 'List the top 10 stars.', 1)
  }

  async run (msg, args) {

  }
}
