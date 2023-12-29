import { Fkt } from './Function'

export class Version extends Fkt {
  async status(data: Buffer, _telLen: number) {
    const majorVersion = data.readUInt8(0)
    const minorVersion = data.readUInt8(1)
    const build = data.readUInt8(2)
    const version = {
      majorVersion,
      minorVersion,
      build
    }
    this.updateStatus(version)
    this.responseReceived = true
  }
}
