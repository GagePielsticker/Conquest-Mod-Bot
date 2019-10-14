const fs = require('fs')

exports.commands = {}

class Command {
  constructor (name = String(), description = String(), func = () => { }, permission = Number()) {
    this.name = name
    this.description = description
    this.func = func
    this.permission = permission

    exports.commands[this.name] = this
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
