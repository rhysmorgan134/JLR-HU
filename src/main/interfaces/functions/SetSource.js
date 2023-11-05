import { Fkt } from './Function'

class SetSource extends Fkt {
    /**
     *
     * @param fktID
     * @param writeMessage
     * @param updateStatus
     */
    writeMessage: (message: FktIdPartMessage) => void
  fktID: number
  updateStatus: (result: Object) => void

  constructor(fktID: number , writeMessage: (message: FktIdPartMessage) => void, updateStatus: (result: Object) => void) {
    super(fktID, writeMessage, updateStatus)
  } {
        super(fktID, writeMessage, updateStatus);
    }

    // /**
    //  *
    //  * @param {Buffer} data
    //  * @param {number} telLen
    //  * @returns {Promise<void>}
    //  */
    // async status(data, telLen) {
    //     let x = data.readUInt8(0)
    //     let status ={magazine: {activeDisk: x}}
    //     this.updateStatus(status)
    //     this.responseReceived = true
    // }
}
module.exports = SetSource
