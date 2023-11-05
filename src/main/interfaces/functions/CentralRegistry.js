import { Fkt } from './Function'
const {fBlocks} = require("../../enums");

class CentralRegistry extends Fkt {
    constructor(fktID, writeMessage,  updateStatus) {
        super(fktID, writeMessage, updateStatus);
    }

    async status(data, telLen) {
        let foundFBlocks = {}
        console.log(foundFBlocks, telLen)
        if(data.length % 4) {
            console.warn("central registry Invalid amount of params ", data.length, data)
            return
        }
        for(let i=0;i<telLen;i+=4) {
            let tempFblockId = data.readUInt8(i+2)
            let readAbleName = tempFblockId in fBlocks ? fBlocks[tempFblockId] : tempFblockId
            console.log(tempFblockId.toString(16), tempFblockId, data.readUInt8(i).toString(16), data.readUInt8(i +1).toString(16))
            if(!(readAbleName in foundFBlocks)) {
                foundFBlocks[readAbleName] = {}
            }
            foundFBlocks[readAbleName][data.readUInt8(i+3)] = {instId: data.readUInt8(i+3), sourceAddrHigh: data.readUInt8(i), sourceAddrLow: data.readUInt8(i +1), fBlock: tempFblockId, functions: {}}
        }
       console.log("found fblocks", foundFBlocks)
        this.responseReceived = true
        this.updateStatus(foundFBlocks)
    }
}
module.exports = CentralRegistry
