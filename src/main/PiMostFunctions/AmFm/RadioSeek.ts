import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class RadioSeek extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer) {
    console.log('seek update', data)
    // let status ={audio: {balance: data.readInt8(0)}}
    // this.updateStatus(status)
    // this.responseReceived = true
  }
}
