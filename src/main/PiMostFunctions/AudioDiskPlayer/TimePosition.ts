import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class TimePosition extends Fkt {
  writeMessage: (message: FktIdPartMessage) => void
  fktID: number
  updateStatus: (result: Object) => void

  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    let x = data.readUInt8(0)
    let status = { media: {} }
    switch (x) {
      case 0:
        status.media.diskTime = data.readUInt32BE(2)
        status.media.trackTime = data.readInt32BE(6)
        status.media.titleTime = data.readUInt32BE(10)
        break
      case 1:
        status.media.diskTime = data.readInt32BE(2)
        break
      case 2:
        status.media.trackTime = data.readInt32BE(2)
        break
      case 3:
        status.media.titleTime = data.readInt32BE(2)
        break
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
