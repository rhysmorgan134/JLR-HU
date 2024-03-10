import { Fkt } from '../Common/Function'

export class GlobalWindowClose extends Fkt {
  async status(data) {
    let status = {
      globalWindowClose: data.readUInt16BE(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
