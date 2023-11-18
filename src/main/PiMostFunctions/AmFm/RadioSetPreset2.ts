import { FktIdPartMessage } from '../../Globals'
import { Fkt } from '../Common/Function'

export class RadioSetPreset2 extends Fkt {
  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  }
    async status(data) {
        console.log("preset update2", data)
    }


}
module.exports = RadioSetPreset2
