import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from "../../Globals";

export class Source extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

    async status(data) {
        let source = data.readInt8(0)
      console.log("source", source)
        // this.updateStatus(status)
        this.responseReceived = true
    }


}
