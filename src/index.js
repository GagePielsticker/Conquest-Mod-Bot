module.exports = {
  events: {
    ready: require('./events/ready'),
    userJoin: require('./events/userJoin'),
    moderation: require('./events/moderation'),
    message: require('./events/message')
  },
  permissionCheck: require('./functions/permissionCheck'),
  convertTime: require('./functions/convertTime')
}
