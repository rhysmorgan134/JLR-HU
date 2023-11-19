import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class AsyncControl extends Fkt {
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
    data = data.readUInt8(0)
    let asyncControl = {
      asyncControlType: data ? 'packet' : 'control'
    }
    this.updateStatus(asyncControl)
    this.responseReceived = true
  }
}
