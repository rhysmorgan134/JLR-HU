import { Fkt } from '../Common/Function'

export class Subwoofer extends Fkt {
  async status(data: Buffer) {
    const status = { subwoofer: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
