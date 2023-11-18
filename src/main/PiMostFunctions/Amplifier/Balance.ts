import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class Balance extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

    async status(data) {
        let status = {balance: data.readInt8(0)}
        this.updateStatus(status)
        this.responseReceived = true
    }


}
