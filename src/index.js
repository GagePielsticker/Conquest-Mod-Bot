module.exports = {
  events: {
    ready: require('./events/ready'),
    userJoin: require('./events/userJoin'),
    message: require('./events/message'),
    Starboard: require('./events/emoji').Starboard,
    moderation: {
      userLeaveorKicked: require('./events/moderation').userLeaveorKicked,
      userBanned: require('./events/moderation').userBanned,
      messageEdit: require('./events/moderation').messageEdit,
      messageDelete: require('./events/moderation').messageDelete
    }
  },
  permissionCheck: require('./functions/permissionCheck'),
  convertTime: require('./functions/convertTime')
}
