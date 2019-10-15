exports.Modlog = class Modlog {
  constructor (client) {
    this.client = client
    this.conquestDatabase = client.conquestCouchDatabase
  }

  async addCase (action, userID, moderatorID, reason) {
    const modlog = await this.conquestDatabase.get('modlog')
    let currentCase = modlog.currentCase
    console.log(currentCase)
  }

  async editCase (caseNumber, moderatorID, newReason) {

  }
}
