module.exports = function (client, guildMemberObject) {
  /**
   * Role Name      Role ID's      Perm Level
   *
   * Member  : 632493565376724992           0
   * Staff   : 597554402123055158           1
   * Game Dir: 632022745827508233           2
   * Dev     : 632020927391203378           2
   * All Perm Bypass: process.env.evalUsers 3
   */
  var highestPermission = Number()

  if (guildMemberObject.roles.has('632493565376724992')) highestPermission = 0
  if (guildMemberObject.roles.has('597554402123055158')) highestPermission = 1
  if (guildMemberObject.roles.has('632022745827508233')) highestPermission = 2
  if (guildMemberObject.roles.has('632020927391203378')) highestPermission = 2
  if (client.evalUsers.includes(guildMemberObject.id)) highestPermission = 3

  return highestPermission
}
