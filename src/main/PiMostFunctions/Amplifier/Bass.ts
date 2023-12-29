import { Fkt } from '../Common/Function'

export class Bass extends Fkt {
  async status(data: Buffer) {
    const status = { bass: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
