import { Fkt } from '../Common/Function'

export class FanSpeed extends Fkt {
  async status(data) {
    const status = {
      fanSpeed: data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
