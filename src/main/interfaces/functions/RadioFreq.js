import { Fkt } from './Function'

class RadioFreq extends Fkt {
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
        let stringEnd = data.indexOf(0x00)
        let x = data.readUInt32BE(stringEnd + 2)
        let preset = data.readUInt8(0)
        let status ={frequency: x, chosenPreset: preset}
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = RadioFreq
