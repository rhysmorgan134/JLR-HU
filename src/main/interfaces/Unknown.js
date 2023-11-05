const EventEmitter = require('events')
const _ = require('lodash')
const FktIDs = require('../PiMostFunctions/Common/FktIDs')
const Notification = require('../PiMostFunctions/Common/Notification')
const GetNotifications = require('../PiMostFunctions/Common/GetNotifications')
const AsyncControl = require('../PiMostFunctions/Common/AsyncControl')
const Version = require('../PiMostFunctions/Common/Version')
const SourceInfo = require('../PiMostFunctions/Common/SourceInfo')

const {fktList} = require('../enums')

class FBlock extends EventEmitter{
    constructor(instID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow, fBlockID) {
        super()
        this.fBlockID = fBlockID
        this.writeMessage = writeMessage
        this.instID = instID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.addressHigh = addressHigh
        this.addressLow = addressLow
        this.status = {}
        this.fktList = {...fktList.general, ...fktList.amplifier}
        this.functions = {
            0x000: new FktIDs(0x000, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x001: new Notification(0x001, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x002: new GetNotifications(0x002, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x003: new AsyncControl(0x003, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x010: new Version(0x010, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x100: new SourceInfo(0x100, this.sendMessage.bind(this), this.updateStatus.bind(this))
        }
        this.state = {}
        this.availableFunctions = {
            getFunctions: this.getFunctions.bind(this),
            allNotifications: this.allNotifcations.bind(this),
            getNotifications: this.getNotifcations.bind(this),
            setGetAsyncControl: this.setGetAsyncControl.bind(this),
            getVersion: this.getVersion.bind(this),
            sendMessage: this.sendMessage.bind(this),
            getSourceInfo: this.getSourceInfo.bind(this),
            checkNotifications: this.checkNotifcations.bind(this)
        }
    }

    async getFunctions() {
       //console.log("getting functions")
        await this.functions[0x000].get()
       //console.log(this.status)
        this.state = {...this.state, ...this.status}
       //console.log(this.state)
        // this.status.forEach((data) => {
        //    //console.log(this.fktList[data])
        // })
    }

    async allNotifcations() {
       //console.log("running all functions")
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE()
        await this.functions[0x001].set([0x00, this.addressHigh, this.addressLow])
    }

    /**
     *  0x002 - Under certain system conditions, it can be helpful if a device can check whether its entries are still existent in the Notification Matrix. In case of an error, a device is able to renew its entries.
     * @param {array<number>} data
     * @returns {Promise<void>}
     */
    async getNotifcations(data) {
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE(0xe08 << 4)
        await this.functions[0x001].set([0x01, 0x01, 0x10, 0x10, 0x0c, 0x21])
    }

    async checkNotifcations(data) {
        await this.functions[0x002].get([this.addressHigh, this.addressLow])
    }

    /**
     *
     * @param {boolean} data - true for packet data false for control data
     * @returns {Promise<void>}
     */
    async setGetAsyncControl(data) {
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE(data << 4)
        await this.functions[0x003].setGet([0x00, this.addressHigh, this.addressLow, ...tempFktId])
    }

    /**
     *  - Get version details of device
     * @returns {Promise<void>}
     */
    async getVersion() {
        await this.functions[0x010].get()
    }

    /**
     *
     * @param {number} data - source number
     * @returns {Promise<void>}
     */
    async getSourceInfo(data) {
        if(!(data)) {
            data= Buffer.from([1])
        }
        await this.functions[0x100].get(Buffer.from([1]))
    }

    async updateStatus(data) {
        this.emit('statusUpdate', {fBlockID: this.fBlockID, instID: this.instID, sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow, data: _.differenceWith([this.status, data], [this.status], _.isEqual)[0]})
        this.status = _.merge(this.status, data)

    }

    sendMessage({fktID, opType, data}) {
        this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
    }
}

module.exports = FBlock
