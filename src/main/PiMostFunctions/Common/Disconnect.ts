import { Fkt } from './Function'
import { FktIdPartMessage } from "../../Globals";

export class Disconnect extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }
    async status(data) {
        console.log('disconnect response', data)
        this.responseReceived = true
    }
}
