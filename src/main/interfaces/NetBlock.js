const FBlockIDs = require('./functions/FBlockIDs')
const Fblock = require('../PiMostFunctions/Common/FBlock')
const GroupAddress = require('./functions/GroupAddress')

class NetBlock extends Fblock {
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow, getImplementedBlocks, getNodePosition) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x01
        this.instID = instID
        this.getNodePosition = getNodePosition
        this.functions = {
            0x000: new FBlockIDs(0x000, this.sendMessage.bind(this), this.updateStatus.bind(this), getImplementedBlocks),
            0x004: new GroupAddress(0x004, this.sendMessage.bind(this), this.updateStatus.bind(this))
        }
        this.status = {}
        this.availableFunctions = {
            getFBlocks: this.getFblocks.bind(this),
            getGroupAddress: this.getGroupAddress.bind(this)
        }
    }

    async getGroupAddress() {
        this.functions[0x004].get()
    }

    async getFblocks() {
        console.log("Getting fBlocks")
        this.functions[0x000].get()
    }

    async sendMessage({fktID, opType, data, sourceAddrHigh, sourceAddrLow}) {
        //console.log("Writing Fblocks")
        this.writeMessage({fBlockID: this.fBlockID, instanceID: await this.getNodePosition(), fktID, opType, data}, {sourceAddrHigh, sourceAddrLow})
    }


}

module.exports = NetBlock
