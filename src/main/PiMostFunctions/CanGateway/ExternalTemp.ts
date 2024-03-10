import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class ExternalTemp extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      externalTemp: data.readUInt16BE(0) / 100
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
