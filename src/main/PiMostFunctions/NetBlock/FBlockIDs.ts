import { Fkt } from '../Common/Function'

export class Volume extends Fkt {
  status(data: Buffer, _telLen: number) {
    const status = {
      audioVolume: data.readUInt8(2),
      parkingVolume: data.readUInt8(10),
      navigationVolume: data.readUInt8(8),
      phoneVolume: data.readUInt8(8)
    }
    this.updateStatus(status)
  }
}
