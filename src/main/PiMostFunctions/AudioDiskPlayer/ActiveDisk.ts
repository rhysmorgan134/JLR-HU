import { Fkt } from '../Common/Function'

export class ActiveDisk extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt8(0)
    const status = { activeDisk: x }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
