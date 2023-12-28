import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'
import { PresetList } from './AmFmTunerTypes'

export class RadioPresetList extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer) {
    const newData = data.subarray(8)
    const stringEnd = newData.indexOf(0x00)
    const channelName = newData.subarray(0, stringEnd)
    const status: PresetList = {
      presetList: {
        [data.readUInt8(0)]: {
          [data.readUInt8(1)]: {
            unknown2: data.readUInt8(2),
            tunerNo2: data.readUInt8(2),
            presetNo2: data.readUInt8(4),
            name: channelName.toString(),
            frequency: newData.readInt32BE(stringEnd + 1)
          }
        }
      }
    }
    this.updateStatus(status)
    this.responseReceived = true
  }
}
