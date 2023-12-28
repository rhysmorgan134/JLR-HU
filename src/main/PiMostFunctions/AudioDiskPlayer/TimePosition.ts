import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class TimePosition extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    let x = data.readUInt8(0)
    let status = {  }
    switch (x) {
      case 0:
        status.diskTime = data.readUInt32BE(2)
        status.trackTime = data.readInt32BE(6)
        status.titleTime = data.readUInt32BE(10)
        break
      case 1:
        status.diskTime = data.readInt32BE(2)
        break
      case 2:
        status.trackTime = data.readInt32BE(2)
        break
      case 3:
        status.titleTime = data.readInt32BE(2)
        break
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}