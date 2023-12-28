import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class Allocate extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data: Buffer, telLen: number) {
    console.log('allocate status', data)

    const channelList: number[] = []
    for (let i = 2; i < telLen; i++) {
      channelList.push(data.readUInt8(i))
    }
    const allocResult = {
      sourceNr: data.readUInt8(0),
      srcDelay: data.readUInt8(1),
      channelList
    }
    this.responseReceived = true
    this.emit('allocResult', allocResult)
  }
}
