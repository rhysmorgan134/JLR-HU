import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class CustSpeakers extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer) {
    const status = { centre: data.readInt8(1) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
