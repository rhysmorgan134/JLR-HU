import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class GlobalWindows extends Fkt {
  async status(data) {
    console.log(data)
    let status: Partial<CanGatewayStatus> = {
      globalWindowClose: !!(data.readUInt8(0) & 0x20),
      globalWindowOpen: !!(data.readUInt8(0) & 0x10)
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
