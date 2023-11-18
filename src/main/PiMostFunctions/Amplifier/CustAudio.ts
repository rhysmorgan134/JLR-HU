import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class CustAudio extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

    async status(data) {
        let status ={mode: data.readUInt8(0), centre: data.readInt8(1)}
        let audioMode = data.readUInt8(0)
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
