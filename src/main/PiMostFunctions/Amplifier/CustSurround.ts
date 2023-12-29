import { Fkt } from '../Common/Function'

export class CustSurround extends Fkt {
  async status(data: Buffer) {
    const status = { mode: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
