import { Fkt } from '../Common/Function'

export class CurrentSource extends Fkt {
  async status(data: Buffer) {
    const status = { source: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
