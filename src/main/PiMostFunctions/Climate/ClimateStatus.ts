import { Fkt } from '../Common/Function'

export class ClimateStatus extends Fkt {
  async status(data) {
    const status = {
      recirc: data.readUInt8(2) ? true : false,
      fanAuto: data.readUInt8(1) === 64 ? true : false,
      windscreen: data.readUInt8(0) & 16 ? true : false,
      ac: data.readUInt8(0) & 32 ? true : false,
      face: data.readUInt8(0) & 4 ? true : false,
      feet: data.readUInt8(0) & 8 ? true : false,
      auto: data.readUInt8(0) & 2 ? true : false
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
