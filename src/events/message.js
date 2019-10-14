module.exports = (client, msg) => {
  if (msg.author.bot) return
  if (msg.guild.id !== '597553336044224522') return
  const userPerms = client.permissionCheck(client, msg.member)
  const prefix = 'cm!'
  const splitMessage = msg.content.replace(/[ ]+/, ' ').split(' ')
  const givenPrefix = splitMessage[0].substring(0, 3).toLowerCase()
  const givenCommand = splitMessage[0].substring(3).toLowerCase()
  const args = splitMessage.splice(1)
  if (givenPrefix === prefix) {
    const command = client.commands.get(givenCommand)
    if (command) {
      if (userPerms >= command.permission) {
        command.run(msg, args)
      }
    }
  }
}
