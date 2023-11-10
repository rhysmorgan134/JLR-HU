import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class Volume extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  status(data, telLen) {
    let status = {}
    status.audioVolume = data.readUInt8(2)
    status.parkingVolume = data.readUInt8(10)
    status.navigationVolume = data.readUInt8(8)
    status.phoneVolume = data.readUInt8(8)
    console.log('volumes', status)
    this.updateStatus(status)
  }
}
