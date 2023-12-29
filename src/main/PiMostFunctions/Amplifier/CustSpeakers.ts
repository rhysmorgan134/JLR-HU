import { Fkt } from '../Common/Function'

export class CustSpeakers extends Fkt {
  async status(data: Buffer) {
    const status = { centre: data.readInt8(1) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
