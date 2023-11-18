import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class RadioFreq extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }
    async status(data) {
        let stringEnd = data.indexOf(0x00)
        let x = data.readUInt32BE(stringEnd + 2)
        let preset = data.readUInt8(0)
        let status ={frequency: x, chosenPreset: preset}
        this.updateStatus(status)
        this.responseReceived = true
    }
}
