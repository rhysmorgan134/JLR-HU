import { Fkt } from '../Common/Function'

export class TrackPosition extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt16BE(0)
    const status = { trackPosition: x }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
