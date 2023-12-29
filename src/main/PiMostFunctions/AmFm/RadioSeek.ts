import { Fkt } from '../Common/Function'

export class RadioSeek extends Fkt {
  async status(data: Buffer) {
    console.log('seek update', data)
    // let status ={audio: {balance: data.readInt8(0)}}
    // this.updateStatus(status)
    // this.responseReceived = true
  }
}
