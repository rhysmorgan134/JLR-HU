import { FktIdPartMessage } from '../../Globals';
import { Fkt } from '../Common/Function'

export class RadioText extends Fkt {
  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

    async status(data) {
        let tempString = data.slice(2)
        let stringEnd = tempString.indexOf(0x00)
        //console.log("radio text", tempString.slice(0, stringEnd -1).toString())
        let status = {}
        status.currentStation = tempString.slice(0, stringEnd).toString()
        this.updateStatus(status)
        this.responseReceived = true
    }
}
