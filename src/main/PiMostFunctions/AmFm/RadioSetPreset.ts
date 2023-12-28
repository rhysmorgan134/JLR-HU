import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class RadioSetPreset extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer) {
    console.log('preset update', data)
    // let status ={audio: {balance: data.readInt8(0)}}
    // this.updateStatus(status)
    // this.responseReceived = true
  }
}
