import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class Loudness extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }
    async status(data) {
        let status ={loudness: data.readUInt8(0)}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
