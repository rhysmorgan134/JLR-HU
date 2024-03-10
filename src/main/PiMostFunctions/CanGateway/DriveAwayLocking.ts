import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class DriveAwayLocking extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      driveAwayLocking: data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
