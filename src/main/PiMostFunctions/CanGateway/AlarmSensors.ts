import { Fkt } from '../Common/Function'
import { CanGatewayStatus } from './CanGatewayTypes'

export class AlarmSensors extends Fkt {
  async status(data) {
    let status: Partial<CanGatewayStatus> = {
      alarmSensors: data.readUInt8(0) <= 0
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
