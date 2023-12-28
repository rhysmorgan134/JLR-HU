import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class Balance extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer) {
    const status = { balance: data.readInt8(0) }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
