import { Fkt } from '../Common/Function'

export class TimePosition extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt8(0)
    let status
    switch (x) {
      case 0:
        status = {
          diskTime: data.readUInt32BE(2),
          trackTime: data.readInt32BE(6),
          titleTime: data.readUInt32BE(10)
        }
        break
      case 1:
        status = { diskTime: data.readInt32BE(2) }
        break
      case 2:
        status = { trackTime: data.readInt32BE(2) }
        break
      case 3:
        status = { titleTime: data.readInt32BE(2) }
        break
    }
    if (status) {
      this.updateStatus(status)
    }
    this.responseReceived = true
  }
}
