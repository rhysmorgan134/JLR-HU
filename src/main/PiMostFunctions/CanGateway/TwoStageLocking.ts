import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class TwoStageLocking extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      twoStageLocking: !!data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}