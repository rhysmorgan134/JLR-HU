import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class Volume extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  status(data, telLen) {
    const status = {
      audioVolume: data.readUInt8(2),
      parkingVolume: data.readUInt8(10),
      navigationVolume: data.readUInt8(8),
      phoneVolume: data.readUInt8(8)
    }
    console.log('volumes', status)
    this.updateStatus(status)
  }
}
