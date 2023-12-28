import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class SetSource extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }
  // /**
  //  *
  //  * @param {Buffer} data
  //  * @param {number} telLen
  //  * @returns {Promise<void>}
  //  */
  async status(data, telLen) {
    console.log('set source unknown', data)
  }
}
