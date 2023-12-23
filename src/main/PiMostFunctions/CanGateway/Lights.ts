import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class Lights extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data) {
    let status = {
      ambientLight: data.readUInt8(3),
      lights: !!data.readUInt8(1)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
