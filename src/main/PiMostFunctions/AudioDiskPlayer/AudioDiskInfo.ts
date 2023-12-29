import { Fkt } from '../Common/Function'
import { AudioDiskInfoTypes } from './AudioDiskPlayerTypes'

export class AudioDiskInfo extends Fkt {
  async status(data: Buffer) {
    const x = data.readUInt8(0)
    const y = data.readUint8()
    let tempString = data.slice(2)
    const stringEnd = tempString.indexOf(0x00)
    tempString = tempString.slice(1, stringEnd)
    const status: AudioDiskInfoTypes = {
      trackName: tempString.toString(),
      playTime: data.readUInt32BE(stringEnd + 3),
      trackNumber: data.readUint16BE(stringEnd + 7),
      fileName: data.slice(stringEnd + 10).toString()
    }
    // switch (x) {
    //     case 0:
    //         status.media.diskTime = data.readUInt32BE(2)
    //         status.media.trackTime = data.readInt32BE(6)
    //         status.media.titleTime = data.readUInt32BE(10)
    //         break
    //     case 1:
    //         status.media.diskTime = data.readInt32BE(2)
    //         break
    //     case 2:
    //         status.media.trackTime = data.readInt32BE(2)
    //         break
    //     case 3:
    //         status.media.titleTime = data.readInt32BE(2)
    //         break
    // }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
