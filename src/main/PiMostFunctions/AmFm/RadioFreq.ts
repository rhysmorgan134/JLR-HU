import { Fkt } from '../Common/Function'

export class RadioFreq extends Fkt {
  async status(data: Buffer) {
    const stringEnd = data.indexOf(0x00)
    const x = data.readUInt32BE(stringEnd + 2)
    const preset = data.readUInt8(0)
    const status = { frequency: x, chosenPreset: preset }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
