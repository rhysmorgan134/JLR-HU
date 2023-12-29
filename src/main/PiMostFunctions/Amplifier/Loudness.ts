import { Fkt } from '../Common/Function'

export class Loudness extends Fkt {
  async status(data: Buffer) {
    const status = { loudness: data.readUInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
