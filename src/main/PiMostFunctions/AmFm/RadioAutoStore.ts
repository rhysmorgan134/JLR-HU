import { Fkt } from '../Common/Function'

export class RadioAutoStore extends Fkt {
  async status(data: Buffer) {
    console.log('AUTO STORE update', data)
    const status = { autoStore: false }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
