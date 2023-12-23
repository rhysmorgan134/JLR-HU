import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class ClimateStatus extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

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
