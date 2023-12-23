import { Fkt } from '../Common/Function'
import { FktIdPartMessage, FrontSensorsType } from '../../Globals'

export class FrontSensors extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data) {
    let status: { parkingSensors: FrontSensorsType } = {
      parkingSensors: {
        frontLeft: 31 - (data.readUInt8(0) & 31),
        frontCentreLeft: 31 - (data.readUInt8(1) & 31),
        frontCentreRight: 31 - (data.readUInt8(2) & 31),
        frontRight: 31 - (data.readUInt8(3) & 31)
      }
    }
    console.log('sensors', status)
    this.updateStatus(status)
    this.responseReceived = true
  }
}
