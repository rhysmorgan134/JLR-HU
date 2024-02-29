import { Fkt } from '../Common/Function'

export class ExternalTemp extends Fkt {
  async status(data) {
    let status = {
      externalTemp: data.readUInt16BE(0) / 100
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
