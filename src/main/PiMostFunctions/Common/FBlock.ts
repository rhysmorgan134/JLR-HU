import {EventEmitter} from "events";
import { FktIDs } from "./FktIDs";
import { Notification } from './Notification'
import { GetNotifications } from './GetNotifications'
import { AsyncControl } from './AsyncControl'
import { Version } from './Version'
import { SourceInfo } from './SourceInfo'
import { Allocate } from './Allocate'
import { Deallocate } from './Deallocate'
import { RawMostRxMessage, SocketMostSendMessage } from "socketmost/dist/modules/Messages";
import { Fkt } from "./Function";
import {_} from 'lodash'

export class FBlock extends EventEmitter {
    fBlockID: number
    writeMessage: (message: SocketMostSendMessage) => void
    sourceAddrHigh: number
    sourceAddrLow: number
    addressHigh: number
    addressLow: number
    instanceID: number
    status: Object
    functions: Record<number, Fkt>
    state: Object
    availableFunctions: Record<string, () => void>

    constructor(instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
        super()
        this.fBlockID = 0x21
        this.writeMessage = writeMessage
        this.instanceID = instanceID
        this.sourceAddrHigh = sourceAddrHigh
        this.sourceAddrLow = sourceAddrLow
        this.addressHigh = addressHigh
        this.addressLow = addressLow
        this.status = {}
        this.functions = {
            0x000: new FktIDs(0x000, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x001: new Notification(0x001, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x002: new GetNotifications(0x002, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x003: new AsyncControl(0x003, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x010: new Version(0x010, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x100: new SourceInfo(0x100, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x101: new Allocate(0x101, this.sendMessage.bind(this), this.updateStatus.bind(this)),
            0x102: new Deallocate(0x102, this.sendMessage.bind(this), this.updateStatus.bind(this)),
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
       console.log("running all functions", this.fBlockID)
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE(0)
        await this.functions[0x001].set([0x00, this.addressHigh, this.addressLow])
    }

    async getNotifcations(data) {
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE(0xe08 << 4)
        await this.functions[0x001].set([0x01, 0x01, 0x10, 0x10, 0x0c, 0x21])
    }

    async checkNotifcations(data) {
        await this.functions[0x002].get([this.addressHigh, this.addressLow])
    }

    async setGetAsyncControl(data) {
        let tempFktId = Buffer.alloc(2)
        tempFktId.writeUint16BE(data << 4)
        // @ts-ignore
        await this.functions[0x003].setGet([0x00, this.addressHigh, this.addressLow, ...tempFktId])
    }

    async getVersion() {
        await this.functions[0x010].get()
    }

    async getSourceInfo(data) {
        if(!(data)) {
            data= Buffer.from([1])
        }
        await this.functions[0x100].get([1])
    }

    async updateStatus(data) {
        this.state = _.merge(this.state, data)
        this.emit('statusUpdate', data)
    }

    allocate(sourceNr: number) {
        this.functions[0x101].startResult([sourceNr])
    }

    deallocate(sourceNr: number) {
        this.functions[0x102].startResult([sourceNr])
    }

    sendMessage({fktId, opType, data}) {
        this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instanceID, fktId, opType, data, targetAddressHigh: this.sourceAddrHigh, targetAddressLow: this.sourceAddrLow})
    }

    parseMessage(message: RawMostRxMessage) {
        this.functions?.[message.fktID]?.parseStatus(message)
    }
}
