import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class LowBatter extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      lowBattery: !!data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
