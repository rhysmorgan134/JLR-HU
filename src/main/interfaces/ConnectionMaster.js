
const Fblock = require('../PiMostFunctions/Common/FBlock')

class ConnectionMaster extends Fblock {
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x03
        this.instID = instID
        this.functions = {
            ...this.functions, ...{}
        }
        this.status = {}
        this.availableFunctions = {
            ...this.availableFunctions, ...{}
        }
    }
}


module.exports = ConnectionMaster
