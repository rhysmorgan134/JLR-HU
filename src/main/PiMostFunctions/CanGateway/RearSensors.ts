import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class RearSensors extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
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
