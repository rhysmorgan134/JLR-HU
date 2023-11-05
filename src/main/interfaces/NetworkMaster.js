const CentralRegistry = require('./functions/CentralRegistry')
const CentralRegistryConfig = require('./functions/CentralRegistryConfig')
const Fblock = require('../PiMostFunctions/Common/FBlock')

class NetworkMaster extends Fblock {
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow, updateCentralRegistry) {
        super(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
        this.fBlockID = 0x02
        this.instID = instID
        this.updateCentralRegistry = updateCentralRegistry
        this.functions = {
            ...this.functions, ...{
                0xA00: new CentralRegistryConfig(0xA00, this.sendMessage.bind(this), this.updateStatus.bind(this), this.queryChanged.bind(this)),
                0xA01: new CentralRegistry(0xA01, this.sendMessage.bind(this), this.updateStatus.bind(this))
            }
        }
        this.status = {}
        this.availableFunctions = {
            ...this.availableFunctions, ...{
                getCentralRegistry: this.getCentralRegistry.bind(this)
            }
        }
    }

    async getCentralRegistry() {
       console.log("getting registry", this.instID, this.updateCentralRegistry)
        await this.functions[0xA01].get()
       //console.log("registry acquired")
        await this.updateCentralRegistry(this.status)
    }

    async queryChanged(data) {
        for(let i=0;i<data.length;i++) {
            await this.functions[0xA01].get([data[i].fBlockID, data[i].instanceID])
        }
        await this.updateCentralRegistry(this.status)
    }

}

module.exports = NetworkMaster
