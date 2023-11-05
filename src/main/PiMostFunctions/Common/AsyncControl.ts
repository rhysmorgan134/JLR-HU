import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class AsyncControl extends Fkt {
  writeMessage: (message: FktIdPartMessage) => void
  fktId: number
  updateStatus: (result: Object) => void

  constructor(
    fktId: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktId, writeMessage, updateStatus)
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
