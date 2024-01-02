import { EventEmitter } from 'events'
import { FktIDs } from './FktIDs'
import { Notification } from './Notification'
import { GetNotifications } from './GetNotifications'
import { AsyncControl } from './AsyncControl'
import { Version } from './Version'
import { SourceInfo } from './SourceInfo'
import { Allocate } from './Allocate'
import { Deallocate } from './Deallocate'
import { messages } from 'socketmost'
import { Fkt } from './Function'
import { merge } from 'lodash'
import { FktIdPartMessage } from '../../Globals'

export abstract class FBlock extends EventEmitter {
  fBlockID: number
  writeMessage: (message: messages.SocketMostSendMessage) => void
  sourceAddrHigh: number
  sourceAddrLow: number
  addressHigh: number
  addressLow: number
  instanceID: number
  status: object
  functions: Record<number, Fkt> = {}
  state: object

  constructor(
    fBlockID: number,
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super()
    this.fBlockID = fBlockID
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.addressHigh = addressHigh
    this.addressLow = addressLow
    this.status = {}
    this.registerFunction(0x000, FktIDs)
    this.registerFunction(0x001, Notification)
    this.registerFunction(0x002, GetNotifications)
    this.registerFunction(0x003, AsyncControl)
    this.registerFunction(0x010, Version)
    this.registerFunction(0x100, SourceInfo)
    this.registerFunction(0x101, Allocate)
    this.registerFunction(0x102, Deallocate)
    this.functions[0x102].on('deallocResult', (source) => {
      console.log('dealloc response received, emitting')
      this.emit('deallocResult', source)
    })
    this.functions[0x101].on('allocResult', (source) => {
      this.emit('allocResult', source)
    })
    this.state = {}
  }

  protected registerFunction = <TFunc extends Fkt>(
    fktId: number,
    type: new (
      fktID: number,
      writeMessage: (message: FktIdPartMessage) => void,
      updateStatus: (result: object) => void
    ) => TFunc
  ) => {
    this.functions[fktId] = new type(fktId, this.sendMessage, this.updateStatus)
  }

  getFunctions = async () => {
    //console.log("getting functions")
    await this.functions[0x000].get()
    //console.log(this.status)
    this.state = { ...this.state, ...this.status }
    //console.log(this.state)
    // this.status.forEach((data) => {
    //    //console.log(this.fktList[data])
    // })
  }

  allNotifcations = async () => {
    console.log('running all functions', this.fBlockID)
    const tempFktId = Buffer.alloc(2)
    tempFktId.writeUint16BE(0)
    await this.functions[0x001].set([0x00, this.addressHigh, this.addressLow])
  }

  getNotifcations = async (_data: Buffer) => {
    const tempFktId = Buffer.alloc(2)
    tempFktId.writeUint16BE(0xe08 << 4)
    await this.functions[0x001].set([0x01, 0x01, 0x10, 0x10, 0x0c, 0x21])
  }

  checkNotifcations = async (_data: Buffer) => {
    await this.functions[0x002].get([this.addressHigh, this.addressLow])
  }

  setGetAsyncControl = async (data: number) => {
    const tempFktId = Buffer.alloc(2)
    tempFktId.writeUint16BE(data << 4)
    await this.functions[0x003].setGet([0x00, this.addressHigh, this.addressLow, ...tempFktId])
  }

  getVersion = async () => {
    await this.functions[0x010].get()
  }

  getSourceInfo = async (data: Buffer) => {
    if (!data) {
      data = Buffer.from([1])
    }
    await this.functions[0x100].get([1])
  }

  updateStatus = async (data: object) => {
    this.state = merge(this.state, data)
    this.emit('statusUpdate', data)
  }

  allocate = (sourceNr: number) => {
    this.functions[0x101].startResult([sourceNr])
  }

  deallocate = (sourceNr: number) => {
    this.functions[0x102].startResult([sourceNr])
  }

  sendMessage = ({ fktID, opType, data }: FktIdPartMessage) => {
    this.writeMessage({
      fBlockID: this.fBlockID,
      instanceID: this.instanceID,
      fktID,
      opType,
      data,
      targetAddressHigh: this.sourceAddrHigh,
      targetAddressLow: this.sourceAddrLow
    })
  }

  parseMessage = (message: messages.MostRxMessage) => {
    this.functions[message.fktID]?.parseStatus(message)
  }
}
