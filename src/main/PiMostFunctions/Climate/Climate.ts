import { FBlock } from '../Common/FBlock'
import { SocketMostSendMessage } from 'socketmost/dist/modules/Messages'
import { Temps } from './Temps'
import { FanSpeed } from './FanSpeed'
import { ClimateStatus } from './ClimateStatus'

// JLR CD Player - 0x000, 0x001, 0x002, 0x090, 0x091, 0x092, 0x101, 0x102, 0x200
// 0x201, 0x202, 0x412, 0x413, 0x420, 0x420, 0x431, 0x451, 0x452, 0xc11, 0xc12
// 0xc13, 0xc14, 0xc20, 0xc21, 0xc31, 0xc33, 0xc34
// 430 431 451 452

export class Climate extends FBlock {
  fBlockID: number
  writeMessage: (message: SocketMostSendMessage) => void
  instanceID: number
  sourceAddrLow: number
  sourceAddrHigh: number

  constructor(
    instanceID: number,
    writeMessage: (message: SocketMostSendMessage) => void,
    sourceAddrHigh: number,
    sourceAddrLow: number,
    addressHigh: number,
    addressLow: number
  ) {
    super(instanceID, writeMessage, sourceAddrHigh, sourceAddrLow, addressHigh, addressLow)
    this.fBlockID = 0x71
    this.writeMessage = writeMessage
    this.instanceID = instanceID
    this.sourceAddrHigh = sourceAddrHigh
    this.sourceAddrLow = sourceAddrLow
    this.status = {}
    this.functions = {
      ...this.functions,
      ...{
        0xc85: new FanSpeed(0xc85, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xc87: new Temps(0xc87, this.sendMessage.bind(this), this.updateStatus.bind(this)),
        0xc88: new ClimateStatus(0xc88, this.sendMessage.bind(this), this.updateStatus.bind(this))
      }
    }
  }
}
