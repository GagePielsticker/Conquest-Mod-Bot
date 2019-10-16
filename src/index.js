module.exports = {
  events: {
    ready: require('./events/ready'),
    userJoin: require('./events/userJoin'),
    message: require('./events/message'),
    starboard: {
      starAdded: require('./events/emoji').starAdded,
      starRemoved: require('./events/emoji').starRemoved
    },
    moderation: {
      userKicked: require('./events/moderation').userKicked,
      userBanned: require('./events/moderation').userBanned
    }
  },
  permissionCheck: require('./functions/permissionCheck'),
  convertTime: require('./functions/convertTime')
}
