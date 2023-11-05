const FktIDs = require('../PiMostFunctions/Common/FktIDs')
const Notification = require('../PiMostFunctions/Common/Notification')
const GetNotifications = require('../PiMostFunctions/Common/GetNotifications')
const Fblock = require('../PiMostFunctions/Common/FBlock')
const CurrentSource = require('./functions/CurrentSource')

const {fktList} = require('../enums')
const CentralRegistryConfig = require("./functions/CentralRegistryConfig");
const CentralRegistry = require("./functions/CentralRegistry");


class Sources extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x10
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {currentSource: null}
        this.functions = {
            ...this.functions, ...{
                0xC01: new CurrentSource(0xC01, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
        this.availableFunctions = {
            ...this.availableFunctions, ...{
                getCurrentSource: this.getCurrentSource.bind(this),
                setCurrentSource: this.setCurrentSource.bind(this)
            }
        }
    }

    async getCurrentSource() {
        this.functions[0xC01].get()
    }

    async setCurrentSource() {
        this.functions[0xC01].increment()
    }

}

module.exports = Sources
