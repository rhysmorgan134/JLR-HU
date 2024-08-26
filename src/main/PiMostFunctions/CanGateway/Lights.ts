import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class Lights extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      ambientLight: data.readUInt8(3),
      lights: !!data.readUInt8(1)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
