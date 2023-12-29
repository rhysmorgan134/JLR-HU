import { Fkt } from '../Common/Function'

export class RandomCd extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const x = data.readUInt8(0)
    const status: { shuffle?: string } = {}
    switch (x) {
      case 0x00:
        status.shuffle = 'off'
        break
      case 0x02:
        status.shuffle = 'disk'
        break
      case 0x03:
        status.shuffle = 'magazine'
        break
      case 0x04:
        status.shuffle = 'allMagazines'
        break
    }

    this.updateStatus(status)
    this.responseReceived = true
  }
}
