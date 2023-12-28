import { FBlock } from '../Common/FBlock'
import { Volume } from './Volume'
import { SetSource } from './SetSource'

export class U240 extends FBlock {
  constructor(instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow) {
    super(instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.fBlockID = 0xf0
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        //0x407: new ExternalTemp(0x407, this.sendMessage, this.updateStatus),
        0x409: new Volume(0x409, this.sendMessage, this.updateStatus),
        0x405: new SetSource(0x405, this.sendMessage, this.updateStatus),
        0x407: new SetSource(0x407, this.sendMessage, this.updateStatus)
      }
    }
    this.status = {}
    this.availableFunctions = {
      ...this.availableFunctions,
      ...{
        // setExternalTemp: this.setExternalTemp.bind(this),
        // getExternalTemp: this.getExternalTemp.bind(this),
        getVolumes: this.getVolumes,
        setSource: this.setSource
      }
    }
  }

  // async getExternalTemp() {
  //     this.functions[0x407].get()
  // }

  // async setExternalTemp() {
  //     this.functions[0x407].set([0x40])
  // }

  getVolumes = async (): Promise<void> => {
    this.functions[0x409].get()
  }

  setSource = async (): Promise<void> => {
    await this.functions[0x405].startResultAck([
      0x00, 0x01, 0x31, 0xa1, 0x01, 0x01, 0x31, 0x02, 0x01, 0x11
    ])
    setTimeout(() => {
      this.setSource2.bind(this)
    }, 100)
  }

  setSource2 = async (): Promise<void> => {
    await this.functions[0x407].startResultAck([0x00, 0x01, 0x31, 0xa1, 0x01, 0x11])
  }

  // async allNotifcations() {
  //     let tempFktId = Buffer.alloc(2)
  //     tempFktId.writeUint16BE()
  //     await this.functions[0x001].set([0x00, 0x01, 0x10])
  // }
  //
  // async getNotifcations(data) {
  //     let tempFktId = Buffer.alloc(2)
  //     tempFktId.writeUint16BE(data << 4)
  //     await this.functions[0x002].set([0x00, 0x01, 0x40, ...tempFktId])
  // }

  // async updateStatus(data) {
  //     this.status = data
  // }

  // sendMessage({fktID, opType, data}) {
  //     this.writeMessage({fBlockID: this.fBlockID, instanceID: this.instID, fktID, opType, data}, {sourceAddrHigh: this.sourceAddrHigh, sourceAddrLow: this.sourceAddrLow})
  // }
}
