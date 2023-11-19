import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class Allocate extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    console.log("allocate status", data)
    const allocResult = {
      sourceNr: data.readUInt8(0),
      srcDelay: data.readUInt8(1),
      channelList: []
    }
    for(let i=2;i<telLen;i++) {
      allocResult.channelList.push(data.readUInt8(i))
    }
    this.responseReceived = true
    this.emit('allocResult', allocResult)
  }
}
