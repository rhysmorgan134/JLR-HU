import { Fkt } from '../Common/Function'

export class Lights extends Fkt {
  async status(data) {
    let status = {
      ambientLight: data.readUInt8(3),
      lights: !!data.readUInt8(1)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
