module.exports = (user) => {
  const logChannel = user.guild.channels.get('632494293851832320')
  const userAge = (Date.now() - user.createdAt) / 1000
  logChannel.send({
    embed: {
      title: 'User Joined:',
      description: `${user.tag}`,
      author: {
        name: 'Conquest Mod Bot',
        url: 'https://conquestsim.io/',
        icon_url: `https://cdn.discordapp.com/embed/avatars/${user.avatar}`
      },
      footer: {
        text: 'Conquest Mod Bot | https://conquestsim.io/'
      },
      fields: [
        {
          name: 'Account Age',
          value: `${user.client.convertTime(userAge)}`
        }
      ],
      color: 0xb545747
    }
  })
}
