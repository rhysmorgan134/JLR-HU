import { Fkt } from './Function'
import { FktIdPartMessage } from '../../Globals'

export class SourceInfo extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  /**
   *
   * @param {Buffer} data
   * @param {number} telLen
   * @returns {Promise<void>}
   */
  async status(data: Buffer, telLen: number) {
    data = data.slice(0, telLen + 1)
    if (data.length % 3) {
      //console.log("source Info Invalid amount of params ", data.length, data)
      return
    }
    const sourceNumber = data.readUInt8(0)
    const sources = {
      [sourceNumber]: {
        ...this.parseDataType(data),
        sourceNumber
      }
    }

    this.updateStatus(sources)
    this.responseReceived = true
  }

  parseDataType(data: Buffer) {
    const dataType = data.readUInt8(1)
    const parsed: {
      resolution?: number
      audioChannels?: number
      srcDelay?: number
      channelList?: number[]
      blockWidth?: number
    } = {}
    switch (dataType) {
      case 0x00:
        parsed.resolution = data.readUInt8(2)
        parsed.audioChannels = data.readUInt8(3)
        parsed.srcDelay = data.readUInt8(4)
        parsed.channelList = [...data.slice(5, data.length + 1)]
        break
      case 0x01:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x02:
        parsed.channelList = [...data.slice(2, data.length + 1)]
        break
      case 0x20:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x21:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x22:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x40:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x41:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
      case 0x42:
        parsed.blockWidth = data.readUInt8(2)
        parsed.channelList = [...data.slice(3, data.length + 1)]
        break
    }
    return parsed
  }
}

module.exports = SourceInfo
