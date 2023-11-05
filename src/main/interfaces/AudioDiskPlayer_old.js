const CentralRegistry = require('./functions/CentralRegistry')

class NetworkMaster {
    constructor(instID, writeMessage, updateCentralRegistry) {
        this.fBlockID = 0x02
        this.writeMessage = writeMessage
        this.instID = instID
        this.updateCentralRegistry = updateCentralRegistry
        this.functions = {
            0xA01: new CentralRegistry(0xA01, this.sendMessage.bind(this), this.updateStatus.bind(this))
        }
        this.status = {}
    }

    async getCentralRegistry() {
       //console.log("getting registry")
        await this.functions[0xA01].get()
       //console.log("registry acquired")
        await this.updateCentralRegistry(this.status)
    }

    async updateStatus(data) {
        this.status = data
    }

    sendMessage({fktID, opType, data}) {
        this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data})
    }
}

module.exports = NetworkMaster