const fs = require('fs')

exports.commands = {}
exports.commands.aliases = {}
/**
 * Command Constructor to initialize a command
 * @param {string} name name of the command
 * @param {array} aliases aliases for the command
 * @param {String} description command description
 * @param {function} func command execution
 * @param {number} permission a number between 0 - 3.
 * @example
 * new Command('example', 'example command', (client, msg, args) => {
 *  msg.channel.send("Hi there!")
 * }, 0)
 *
 * @constructor
 */
class Command {
  constructor (name, aliases, description, func, permission) {
    this.name = name
    this.aliases = aliases
    this.description = description
    this.func = func
    this.permission = permission

    exports.commands[this.name] = this
    aliases.map(commandAlias => {
      exports.commands.aliases[commandAlias] = this.name
    })
    console.log(`[Conquest] ${this.name} constructed.`)
    return this
  }
}
exports.Command = Command

exports.init = () => new Promise((resolve, reject) => {
  try {
    const files = fs.readdirSync('./src/commands/', 'utf-8')
    files.map(file => { if (file !== 'index.js') require(`./${file}`) })
    resolve(exports.commands)
  } catch (e) {
    reject(e)
  }
})
