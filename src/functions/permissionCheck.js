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
  var permOutput = {}

  // Member Check
  if (guildMemberObject.roles.has('632493565376724992')) permOutput[0] = true
  else permOutput[0] = false
  // Staff Check
  if (guildMemberObject.roles.has('597554402123055158')) permOutput[1] = true
  else permOutput[1] = false
  // Developer Check && Game Director Check
  if (guildMemberObject.roles.has('632022745827508233')) permOutput[2] = true
  else if (guildMemberObject.roles.has('632020927391203378')) permOutput[2] = true
  else permOutput[2] = false
  // All Perm Bypass Check
  if (client.evalUsers.includes(guildMemberObject.id)) permOutput[3] = true
  else permOutput[3] = false

  return permOutput
}
