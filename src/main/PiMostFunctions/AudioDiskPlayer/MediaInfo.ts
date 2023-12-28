import { Fkt } from '../Common/Function'

export class MediaInfo extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt8(0)
    let tempString = data.slice(2)
    const stringEnd = tempString.indexOf(0x00)
    tempString = tempString.slice(1, stringEnd)
    const status = {
      disks: {
        [x]: {
          albumName: tempString.toString(),
          type: data.readUInt8(stringEnd + 3),
          fileSystem: data.readUInt8(stringEnd + 4),
          firstTrack: data.readUint16BE(stringEnd + 5),
          lastTrack: data.readUint16BE(stringEnd + 7),
          totalPlayTime: data.readUint32BE(stringEnd + 9)
        }
      }
    }

    // let status ={media: {}}
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
