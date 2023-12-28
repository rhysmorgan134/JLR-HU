import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class RadioText extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer) {
    const tempString = data.slice(2)
    const stringEnd = tempString.indexOf(0x00)
    //console.log("radio text", tempString.slice(0, stringEnd -1).toString())
    const status = {
      currentStation: tempString.slice(0, stringEnd).toString()
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
