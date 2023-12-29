import { Fkt } from '../Common/Function'

export class CustAudio extends Fkt {
  async status(data: Buffer) {
    const status = { mode: data.readUInt8(0), centre: data.readInt8(1) }
    const audioMode = data.readUInt8(0)
    // switch (audioMode) {
    //     case 0x00:
    //         status.mode = "stereo"
    //         break
    //     case 0x01:
    //         status.mode = "3Channel"
    //         break
    //     case 0x02:
    //         status.mode = "dolbyProLogic"
    //         break

    //}
    this.updateStatus(status)
    this.responseReceived = true
  }
}
