import { EventEmitter } from 'events'
import { FktIDs } from './FktIDs'
import { Notification } from './Notification'
import { GetNotifications } from './GetNotifications'
import { AsyncControl } from './AsyncControl'
import { Version } from './Version'
import { SourceInfo } from './SourceInfo'
import { Allocate } from './Allocate'
import { Deallocate } from './Deallocate'
import { MostRxMessage, SocketMostSendMessage } from 'socketmost/dist/src/modules/Messages'
import { Fkt } from './Function'
import { merge } from 'lodash'
import { FktIdPartMessage } from '../../Globals'

export class FBlock extends EventEmitter {
  fBlockID: number
  writeMessage: (message: SocketMostSendMessage) => void
  sourceAddrHigh: number
  sourceAddrLow: number
  addressHigh: number
  addressLow: number
  instanceID: number
  status: object
  functions: Record<number, Fkt>
  state: object
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableFunctions: Record<string, (data: any) => Promise<void> | void>

  constructor(
    instanceID: number,
    writeMessage: (message: SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
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
      0x000: new FktIDs(0x000, this.sendMessage, this.updateStatus),
      0x001: new Notification(0x001, this.sendMessage, this.updateStatus),
      0x002: new GetNotifications(0x002, this.sendMessage, this.updateStatus),
      0x003: new AsyncControl(0x003, this.sendMessage, this.updateStatus),
      0x010: new Version(0x010, this.sendMessage, this.updateStatus),
      0x100: new SourceInfo(0x100, this.sendMessage, this.updateStatus),
      0x101: new Allocate(0x101, this.sendMessage, this.updateStatus),
      0x102: new Deallocate(0x102, this.sendMessage, this.updateStatus)
    }
    this.functions[0x102].on('deallocResult', (source) => {
      console.log('dealloc response received, emitting')
      this.emit('deallocResult', source)
    })
    this.functions[0x101].on('allocResult', (source) => {
      this.emit('allocResult', source)
    })
    this.state = {}
    this.availableFunctions = {
      getFunctions: this.getFunctions,
      allNotifications: this.allNotifcations,
      getNotifications: this.getNotifcations,
      setGetAsyncControl: this.setGetAsyncControl,
      getVersion: this.getVersion,
      sendMessage: this.sendMessage,
      getSourceInfo: this.getSourceInfo,
      checkNotifications: this.checkNotifcations
    }
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

  getNotifcations = async (data: Buffer) => {
    const tempFktId = Buffer.alloc(2)
    tempFktId.writeUint16BE(0xe08 << 4)
    await this.functions[0x001].set([0x01, 0x01, 0x10, 0x10, 0x0c, 0x21])
  }

  checkNotifcations = async (data: Buffer) => {
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

  parseMessage = (message: MostRxMessage) => {
    this.functions?.[message.fktID]?.parseStatus(message)
  }
}
