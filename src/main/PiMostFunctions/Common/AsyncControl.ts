import { Fkt } from './Function'

export class AsyncControl extends Fkt {
  async status(data: Buffer, telLen: number) {
    const value = data.readUInt8(0)
    const asyncControl = {
      asyncControlType: value ? 'packet' : 'control'
    }
    this.updateStatus(asyncControl)
    this.responseReceived = true
  }
}
