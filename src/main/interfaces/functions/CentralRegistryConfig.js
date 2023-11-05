import { Fkt } from './Function'
const {fBlocks} = require("../../enums");

class CentralRegistryConfig extends Fkt {
    constructor(fktID, writeMessage,  updateStatus, queryChanged) {
        super(fktID, writeMessage, updateStatus);
        this.queryChanged = queryChanged
    }

    async status(data, telLen) {

        let changedFblocks = []
        if((data.length -1) % 2) {
            console.warn("central registry Invalid amount of params on change", data.length, data)
            return
        }
        for(let i=1;i<telLen;i+=2) {
            console.log("changed FBlockID", data.readUInt8(i).toString(16), ' Instance: ', data.readUInt8(i+1) )
            let tempFblockId = data.readUInt8(i)
            let readAbleName = tempFblockId in fBlocks ? fBlocks[tempFblockId] : tempFblockId
            changedFblocks.push({fBlock: readAbleName, instanceID: data.readUInt8(i+1), fBlockID: tempFblockId})
        }
       //console.log("changed fblock", changedFblocks)
        //this.queryChanged(changedFblocks)
    }
}
module.exports = CentralRegistryConfig
