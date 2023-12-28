import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class TrackPosition extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt16BE(0)
    const status = { trackPosition: x }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
