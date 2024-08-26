import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class AutoLock extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      autoLock: !!data.readUInt8(0)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
