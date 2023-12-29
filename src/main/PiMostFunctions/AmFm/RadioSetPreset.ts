import { Fkt } from '../Common/Function'

export class RadioSetPreset extends Fkt {
  async status(data: Buffer) {
    console.log('preset update', data)
    // let status ={audio: {balance: data.readInt8(0)}}
    // this.updateStatus(status)
    // this.responseReceived = true
  }
}
