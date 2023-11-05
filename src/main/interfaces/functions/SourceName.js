import { Fkt } from './Function'

class SourceName extends Fkt {
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
        let majorVersion = data.readUInt8(0)
        let minorVersion = data.readUInt8(1)
        let build = data.readUInt8(2)
        let version = {
            majorVersion,
            minorVersion,
            build
        }
        this.updateStatus(version)
        this.responseReceived = true
    }
}
module.exports = SourceName
