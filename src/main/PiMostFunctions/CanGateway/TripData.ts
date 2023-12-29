import { Fkt } from '../Common/Function'

export class TripData extends Fkt {
  async status(data) {
    let status = {
      avgMpg: data.readUInt16BE(5) / 10,
      range: data.readUInt16BE(13),
      distance: data.readUInt16BE(11),
      avgSpeed: data.readUInt16BE(7) / 10
    }
    this.updateStatus(status)
    console.log('trip data', status)
    this.responseReceived = true
  }
}
