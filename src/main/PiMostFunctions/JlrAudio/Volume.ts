import { Fkt } from '../Common/Function'

export class Volume extends Fkt {
  status(data: Buffer, _telLen: number) {
    console.log('audio', data, _telLen)
    const status = {
      audioVolume: data.readUInt8(2),
      parkingVolumeFront: data.readUInt8(10),
      parkingVolumeRear: data.readUInt8(10),
      navigationVolume: data.readUInt8(8),
      phoneVolume: data.readUInt8(6)
    }
    this.updateStatus(status)
  }
}
