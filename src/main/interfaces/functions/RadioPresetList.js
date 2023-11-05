import { Fkt } from './Function'

class RadioPresetList extends Fkt {
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
        let tData = {}
        let status = {presetList: {}}
        status.presetList[data.readUInt8(0)] = {}
        status.presetList[data.readUInt8(0)][data.readUInt8(1)] = {}
        tData.unknown2 = data.readUInt8(2)
        tData.tunerNo2 = data.readUInt8(3)
        tData.presetNo2 = data.readUInt8(4)
        let newData = data.subarray(8)
        let stringEnd = newData.indexOf(0x00)
        let channelName = newData.subarray(0, stringEnd)
        console.log(newData)
        status.presetList[data.readUInt8(0)][data.readUInt8(1)].name = channelName.toString()
        status.presetList[data.readUInt8(0)][data.readUInt8(1)].frequency = newData.readInt32BE(stringEnd + 1)
        console.log("RADIO DATA", tData)

        //console.log("radio text", tempString.slice(0, stringEnd -1).toString())
        // let status = {amFmTuner:  {}}
        // status.amFmTuner.currentStation = tempString.slice(0, stringEnd).toString()
        this.updateStatus(status)
        this.responseReceived = true
    }
}
module.exports = RadioPresetList
