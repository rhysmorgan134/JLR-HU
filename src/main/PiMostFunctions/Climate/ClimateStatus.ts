import { Fkt } from '../Common/Function'

export class ClimateStatus extends Fkt {
  async status(data) {
    const status = {
      recirc: data.readUInt8(2) ? true : false,
      auto: data.readUInt8(1) === 64 ? true : false,
      maxDefrost: data.readUInt8(0) & 16 ? true : false
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
