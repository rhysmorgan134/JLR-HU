import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class Time extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      hours: data.readUInt8(0),
      minutes: data.readUInt8(1)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
