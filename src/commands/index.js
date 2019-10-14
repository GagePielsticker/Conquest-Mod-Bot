const fs = require('fs')

/**
 * Command Constructor to initialize a command
 * @param {string || array} name name of the command
 * @param {String} description command description
 * @param {function} func command execution
 * @param {number} permission a number between 0 - 3.
 *
 * @constructor
 */
class Command {
  constructor (client, name, description, permission = 0) {
    this.name = name
    this.description = description
    this.permission = permission
    this.client = client
  }

  run (msg, args) {
    console.log(this.name)
  }
}

/**
 * Export Command Constructor
 */
exports.Command = Command

/**
 * @description Initialises the commands ready for use by the bot
 */
exports.init = (client) => new Promise((resolve, reject) => {
  try {
    const files = fs.readdirSync('./src/commands/', 'utf-8')
    files.map(file => {
      if (file !== 'index.js') {
        var _Command = require(`./${file}`)
        var Command = new _Command(client)
        if (typeof (Command.name) === 'string') client.commands.set(Command.name, Command)
        else if (typeof (Command.name) === 'object') Command.name.map(commandName => client.commands.set(commandName, Command))
        else throw TypeError('Command Name must be an Object or String')
      }
    })
    resolve(true)
  } catch (e) {
    reject(e)
  }
})
