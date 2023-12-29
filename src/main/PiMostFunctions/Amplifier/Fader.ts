import { Fkt } from '../Common/Function'

export class Fader extends Fkt {
  async status(data: Buffer) {
    const status = { fader: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
