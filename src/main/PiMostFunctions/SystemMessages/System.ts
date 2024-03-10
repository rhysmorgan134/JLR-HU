import { FBlock } from '../Common/FBlock'
import { Volume } from './Volume'
import { SetSource } from './SetSource'
import { messages } from 'socketmost'

export class U240 extends FBlock {
  constructor(
    instanceID: number,
    writeMessage: (message: messages.SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(0xf0, instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.registerFunction(0x409, Volume)
    this.registerFunction(0x405, SetSource)
    this.registerFunction(0x407, SetSource)
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
