import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'
import { AudioDiskInfoTypes } from "./AudioDiskPlayerTypes";

export class AudioDiskInfo extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    let x = data.readUInt8(0)
    let y = data.readUint8()
    console.log(data)
    let tempString = data.slice(2)
    let stringEnd = tempString.indexOf(0x00)
    tempString = tempString.slice(1, stringEnd)
    let status: AudioDiskInfoTypes = {
      trackName: tempString.toString(),
      playTime: data.readUInt32BE(stringEnd + 3),
      trackNumber: data.readUint16BE(stringEnd + 7),
      fileName: data.slice(stringEnd + 10).toString(),
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
