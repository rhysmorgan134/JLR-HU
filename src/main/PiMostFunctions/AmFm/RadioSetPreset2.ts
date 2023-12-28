import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class RadioSetPreset2 extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  async status(data: Buffer) {
    console.log('preset update2', data)
  }
}
module.exports = RadioSetPreset2
