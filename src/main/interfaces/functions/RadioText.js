import { Fkt } from './Function'

class RadioText extends Fkt {
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

    /**
     *
     * @param {Buffer} data
     * @param {number} telLen
     * @returns {Promise<void>}
     */
    async status(data, telLen) {
        let tempString = data.slice(2)
        let stringEnd = tempString.indexOf(0x00)
        //console.log("radio text", tempString.slice(0, stringEnd -1).toString())
        let status = {}
        status.currentStation = tempString.slice(0, stringEnd).toString()
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = RadioText
