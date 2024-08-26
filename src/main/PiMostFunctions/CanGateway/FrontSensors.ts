import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class FrontSensors extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
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
