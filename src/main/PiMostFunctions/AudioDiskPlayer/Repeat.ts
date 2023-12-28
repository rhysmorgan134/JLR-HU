import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class Repeat extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer, telLen: number) {
    const x = data.readUInt8(0)
    const status: { repeat?: string } = {}
    switch (x) {
      case 0x00:
        status.repeat = 'off'
        break
      case 0x01:
        status.repeat = 'track'
        break
      case 0x02:
        status.repeat = 'disk'
        break
      case 0x03:
        status.repeat = 'magazine'
        break
    }

    this.updateStatus(status)
    this.responseReceived = true
  }
}
