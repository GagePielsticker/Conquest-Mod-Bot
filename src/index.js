module.exports = {
  events: {
    ready: require('./events/ready'),
    userJoin: require('./events/userJoin'),
    moderation: require('./events/moderation')
  },
  convertTime: require('./functions/convertTime')
}
