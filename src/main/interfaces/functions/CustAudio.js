import { Fkt } from './Function'

class CustAudio extends Fkt {
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
        let status ={audio: {centre: data.readInt8(1)}}
        let audioMode = data.readUInt8(0)
        switch (audioMode) {
            case 0x00:
                status.audio.mode = "stereo"
                break
            case 0x01:
                status.audio.mode = "3Channel"
                break
            case 0x02:
                status.audio.mode = "dolbyProLogic"
                break

        }
        this.updateStatus(status)
        this.responseReceived = true
    }


}
module.exports = CustAudio
