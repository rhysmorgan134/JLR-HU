const FktIDs = require('../PiMostFunctions/Common/FktIDs')
const Notification = require('../PiMostFunctions/Common/Notification')
const GetNotifications = require('../PiMostFunctions/Common/GetNotifications')
const MixerLevel = require('../PiMostFunctions/AudioDiskPlayer/MixerLevel')
const Volume = require('../PiMostFunctions/JlrAudio/Volume')
const RadioText = require('./functions/RadioText')
const Fblock = require('../PiMostFunctions/Common/FBlock')
const RadioPreset = require('./functions/RadioPreset')
const RadioPresetList = require('./functions/RadioPresetList')
const RadioFrequncy = require('./functions/RadioFreq')
const RadioSetPreset = require('./functions/RadioSetPreset')
const RadioSetPreset2 = require('./functions/RadioSetPreset2')
const RadioAutoStore = require('./functions/RadioAutoStore')
const RadioSeek = require('./functions/RadioSeek')

class AmFmTuner extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x40
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
        this.functions = {...this.functions, ...{
                0xD0C: new RadioText(0xD0C, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD11: new RadioPreset(0xD11, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD50: new RadioPresetList(0xD50, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD01: new RadioFrequncy(0xD01, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD10: new RadioSetPreset(0xD10, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD00: new RadioSetPreset2(0xD00, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD13: new RadioAutoStore(0xD13, this.sendMessage.bind(this), this.updateStatus.bind(this)),
                0xD03: new RadioSeek(0xD03, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
        this.availableFunctions = {...this.availableFunctions, ...{
                changePreset: this.changePreset.bind(this),
                getPresets: this.getPresets.bind(this),
                setPreset: this.setPreset.bind(this),
                autoStore: this.autoStore.bind(this),
                savePreset: this.savePreset.bind(this),
                seek: this.seek.bind(this)
            }
        }
    }

    async changePreset(data) {
        await this.functions[0xD11].startResult(data)
    }

    async savePreset(data) {
        await this.functions[0xD10].setGet(data)
    }

    async getPresets() {
        await this.functions[0xD50].get([0x00, 0x00, 0x00])
    }

    // async setPreset(presetNumber) {
    //     await this.functions[0xD10].setGet([0x06, 0x02])
    //     await setTimeout(async () => {
    //         await this.setPreset2()
    //     }, 20)
    // }

    async autoStore() {
        await this.updateStatus({autoStore: true})
        await this.functions[0xD13].setGet([0x04, 0x09])
    }

    async setPreset(data) {
        let type = data[1]
        let presetNumber = data[0]
        await this.functions[0xD50].get([type, 0x00, 0x00])
        // if(type.includes('fm')) {
        //     type = 0x01
        // } else {
        //     type = 0x02
        // }
        // await this.functions[0xD00].setGet([type, presetNumber, 0x06, presetNumber])
        // await setTimeout(async () => {
        //     await this.setPreset3(presetNumber)
        // }, 20)
        //await this.setPreset3()
    }

    async seek(data) {
        this.functions[0xD03].setGet(data)
    }

    async setPreset3(presetNumber) {
        await this.functions[0xD50].get([presetNumber, 0x00, 0x00])
    }

    async setFrequency() {

    }

}

module.exports = AmFmTuner
