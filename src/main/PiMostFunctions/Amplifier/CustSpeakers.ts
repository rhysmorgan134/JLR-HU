import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class CustSpeakers extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }
    async status(data) {
        let status ={centre: data.readInt8(1)}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
