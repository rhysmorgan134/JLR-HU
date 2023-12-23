import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class ExternalTemp extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data) {
    let status = {
      externalTemp: data.readUInt16BE(0) / 100
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
