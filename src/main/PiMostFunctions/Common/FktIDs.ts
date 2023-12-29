import { Fkt } from './Function'

export class FktIDs extends Fkt {
  async status(data: Buffer, telLen: number) {
    //console.log('functions', data, telLen)
    const functions = []
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

    const activeData = []
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
