const FktIDs = require('../PiMostFunctions/Common/FktIDs')
const Notification = require('../PiMostFunctions/Common/Notification')
const GetNotifications = require('../PiMostFunctions/Common/GetNotifications')
const Fblock = require('../PiMostFunctions/Common/FBlock')

const {fktList} = require('../enums')


class GraphicDisplay extends Fblock{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x60
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.status = {}
    }

}

module.exports = GraphicDisplay
