import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class Subwoofer extends Fkt {

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

    async status(data) {
        let status ={subwoofer: data.readInt8(0)}
        this.updateStatus(status)
        this.responseReceived = true
    }


}