import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class RadioAutoStore extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data) {
    console.log('AUTO STORE update', data)
    let status = { autoStore: false }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
