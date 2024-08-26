import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class MirrorFoldBack extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      mirrorFoldBack: !!data.readUInt8(0),
      mirrorDip: !!data.readUInt8(1)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
