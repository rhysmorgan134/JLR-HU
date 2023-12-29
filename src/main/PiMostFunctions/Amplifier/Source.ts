import { Fkt } from '../Common/Function'

export class Source extends Fkt {
  async status(data: Buffer) {
    const source = data.readInt8(0)
    console.log('source', source)
    // this.updateStatus(status)
    this.responseReceived = true
  }
}
