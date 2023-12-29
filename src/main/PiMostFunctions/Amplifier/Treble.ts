import { Fkt } from '../Common/Function'

export class Treble extends Fkt {
  async status(data: Buffer) {
    const status = { treble: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
