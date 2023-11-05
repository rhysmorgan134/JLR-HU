import { Fkt } from './Function'

class Volume extends Fkt {
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
        this.volumes = {
            audioVolume: 0,
            parkingVolume: 0,
            navigationVolume: 0,
            phoneVolume: 0
        }
    }

    /**
     *
     * @param {Buffer} data
     * @param {number} telLen
     * @returns {Promise<void>}
     */
    async status(data, telLen) {
        let status = {}
        this.volumes.audioVolume = data.readUInt8(2)
        this.volumes.parkingVolume = data.readUInt8(10)
        this.volumes.navigationVolume = data.readUInt8(8)
        this.volumes.phoneVolume = data.readUInt8(8)
        status = {...status, ...this.volumes}
        this.updateStatus(status)
    }
}
module.exports = Volume
