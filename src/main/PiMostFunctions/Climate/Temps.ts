import { Fkt } from '../Common/Function'

export class Temps extends Fkt {
  async status(data) {
    console.log('TEMPS', data)
    const side = data.readUInt8(0)
    const status: { leftTemp?: number; rightTemp?: number } = {}
    if (side === 1) {
      status.leftTemp = data.readUInt16BE(2) / 10.0
    } else if (side === 2) {
      status.rightTemp = data.readUInt16BE(2) / 10.0
    } else if (side === 0) {
      status.leftTemp = data.readUInt16BE(2) / 10.0
      status.rightTemp = data.readUInt16BE(4) / 10.0
    }
    this.updateStatus(status)
    console.log(status)
    this.responseReceived = true
  }
}
