import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class PassiveArming extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      passiveArming: !!data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
