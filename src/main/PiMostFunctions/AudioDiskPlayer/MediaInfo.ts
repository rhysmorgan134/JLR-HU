import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class MediaInfo extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, _telLen: number) {
    let x = data.readUInt8(0)
    let tempString = data.slice(2)
    let stringEnd = tempString.indexOf(0x00)
    tempString = tempString.slice(1, stringEnd)
    let status = { disks: {}}
    if (!status.disks[x]) {
      status.disks[x] = {}
    }
    status.disks[x].albumName = tempString.toString()
    status.disks[x].type = data.readUInt8(stringEnd + 3)
    status.disks[x].fileSystem = data.readUInt8(stringEnd + 4)
    status.disks[x].firstTrack = data.readUint16BE(stringEnd + 5)
    status.disks[x].lastTrack = data.readUint16BE(stringEnd + 7)
    status.disks[x].totalPlayTime = data.readUint32BE(stringEnd + 9)

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
