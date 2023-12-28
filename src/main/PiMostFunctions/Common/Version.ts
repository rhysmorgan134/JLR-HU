import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class Version extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, _telLen: number) {
    const majorVersion = data.readUInt8(0)
    const minorVersion = data.readUInt8(1)
    const build = data.readUInt8(2)
    const version = {
      majorVersion,
      minorVersion,
      build
    }
    this.updateStatus(version)
    this.responseReceived = true
  }
}
