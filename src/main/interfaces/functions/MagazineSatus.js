import { Fkt } from './Function'

class MagazineStatus extends Fkt {
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
        let x = data.readUInt8(0)
        let status ={magazine: {}}
        switch (x) {
            case 0x00:
                status.magazine.state = 'NoMagazine'
                break
            case 0x01:
                status.magazine.state = 'MagazineLoaded'
                break
            case 0x02:
                status.magazine.state = "DiskCheck"
                break
            case 0x03:
                status.magazine.state = "DiskChange"
                break


        }
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = MagazineStatus
