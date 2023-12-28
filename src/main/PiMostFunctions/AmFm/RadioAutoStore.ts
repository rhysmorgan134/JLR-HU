import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class RadioAutoStore extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer) {
    console.log('AUTO STORE update', data)
    const status = { autoStore: false }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
