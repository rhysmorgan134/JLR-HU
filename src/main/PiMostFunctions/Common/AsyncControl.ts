import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class AsyncControl extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, telLen: number) {
    const value = data.readUInt8(0)
    const asyncControl = {
      asyncControlType: value ? 'packet' : 'control'
    }
    this.updateStatus(asyncControl)
    this.responseReceived = true
  }
}
