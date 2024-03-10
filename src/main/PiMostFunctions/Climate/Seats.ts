import { Fkt } from '../Common/Function'
import { SeatTemp } from './ClimateTypes'

export class Seats extends Fkt {
  async status(data) {
    const status: { leftSeat?: SeatTemp; rightSeat?: SeatTemp } = {}
    if (data.readUInt8(0) === 0x01) {
      status.leftSeat = this.parseTemp(data[2])
    } else if (data.readUInt8(0) === 0x02) {
      status.rightSeat = this.parseTemp(data[2])
    }
    this.updateStatus(status)
    this.responseReceived = true
  }

  parseTemp(temp): SeatTemp {
    if (temp > 3) {
      temp = (temp - 16) * -1
    }
    return temp
  }
}
