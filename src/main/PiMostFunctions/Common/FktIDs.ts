import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class FktIDs extends Fkt {
  writeMessage: (message: FktIdPartMessage) => void
  fktID: number
  updateStatus: (result: Object) => void

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    //console.log('functions', data, telLen)
    let functions = []
    for (let i = 0; i < telLen - 1; i += 3) {
      functions.push((data.readUint16BE(i) >> 4).toString(16))
      if (i + 1 < data.length - 1) {
        functions.push((data.readUint16BE(i + 1) & 0xfff).toString(16))
      }
    }
    console.log()
    if (functions[functions.length - 1] === '0') {
      console.log('popping 0')
      functions.pop()
    }

    let activeData = []
    let enabled = true
    for (let i = 0; i < 4096; i++) {
      if (functions.indexOf(i.toString(16)) > -1) {
        console.log('switching enabled', i.toString(16))
        enabled = enabled ? false : true
      }
      if (enabled) {
        activeData.push(i.toString(16))
      }
    }
    this.updateStatus(functions)
    this.responseReceived = true
  }
}
