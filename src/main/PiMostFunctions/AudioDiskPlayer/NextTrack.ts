import { Fkt } from '../Common/Function'
import { FktIdPartMessage } from '../../Globals'

export class NextTrack extends Fkt {
  constructor(
    fktID: number,
    writeMessage: (message: FktIdPartMessage) => void,
    updateStatus: (result: Object) => void
  ) {
    super(fktID, writeMessage, updateStatus)
  }

  async status(data, telLen) {
    console.log('next track data: ', data)
  }
}
