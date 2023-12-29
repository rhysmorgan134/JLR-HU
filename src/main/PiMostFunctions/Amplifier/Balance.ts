import { Fkt } from '../Common/Function'

export class Balance extends Fkt {
  async status(data: Buffer) {
    const status = { balance: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
