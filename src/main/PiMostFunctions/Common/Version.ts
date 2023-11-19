import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class Version extends Fkt {
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
    let majorVersion = data.readUInt8(0)
    let minorVersion = data.readUInt8(1)
    let build = data.readUInt8(2)
    let version = {
      majorVersion,
      minorVersion,
      build
    }
    this.updateStatus(version)
    this.responseReceived = true
  }
}
