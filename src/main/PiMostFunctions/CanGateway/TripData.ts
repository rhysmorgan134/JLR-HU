import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class TripData extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

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
