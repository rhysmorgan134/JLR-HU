import { Fkt } from '../Common/Function'
import { FktIdPartMessage, RearSensorsType } from '../../Globals'

export class RearSensors extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data) {
    let status: { parkingSensors: RearSensorsType } = {
      parkingSensors: {
        rearLeft: 31 - (data.readUInt8(0) & 31),
        rearCentreLeft: 31 - (data.readUInt8(1) & 31),
        rearCentreRight: 31 - (data.readUInt8(2) & 31),
        rearRight: 31 - (data.readUInt8(3) & 31)
      }
    }
    console.log('sensors', status)
    this.updateStatus(status)
    this.responseReceived = true
  }
}
