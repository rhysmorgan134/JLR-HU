import { Fkt } from './Function'

export class Disconnect extends Fkt {
  async status(data: Buffer) {
    console.log('disconnect response', data)
    this.responseReceived = true
  }
}
