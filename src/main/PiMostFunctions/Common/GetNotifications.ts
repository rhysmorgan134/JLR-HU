import { Fkt } from './Function'

export class GetNotifications extends Fkt {
  async status(_data: Buffer, _telLen: number) {
    // let functions = []
    // for(let i=0;i<data.length;i+=3) {
    //     functions.push((data.readUint16BE(i) >> 4))
    //     if((i+1) < data.length-1) {
    //         functions.push((data.readUint16BE(i+1) & 0xFFF))
    //     }
    // }
    // this.updateStatus(functions)
    //console.log(data, telLen)
    this.responseReceived = true
  }
}
